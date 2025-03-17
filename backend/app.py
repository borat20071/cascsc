from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import hashlib
import uuid
from datetime import datetime, timedelta, date
import os
import re
import functools

app = Flask(__name__, static_folder='../dist', static_url_path='/')
app.secret_key = 'science_hub_secret_key'  # For session management

# Login required decorator
def login_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        # Allow test user ID from header for development/testing
        if not user_id and request.headers.get('X-User-ID'):
            user_id = request.headers.get('X-User-ID')
            
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Admin required decorator
def admin_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        # Allow test user role from header for development/testing
        if (not user_id or not user_role) and request.headers.get('X-User-ID'):
            user_id = request.headers.get('X-User-ID')
            # For simplicity in testing, assume user is admin if using the header
            user_role = 'admin'
            
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        if user_role != 'admin':
            return jsonify({"error": "Admin privileges required"}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# Extract ngrok subdomain from environment for dynamic CORS
def get_ngrok_url():
    import requests
    try:
        # Try to get ngrok tunnel info from the local API
        response = requests.get('http://localhost:4040/api/tunnels')
        data = response.json()
        for tunnel in data['tunnels']:
            if tunnel['proto'] == 'https':
                return tunnel['public_url']
        return None
    except:
        return None

ngrok_url = get_ngrok_url()
allowed_origins = ["http://localhost:3000", "http://localhost:4173", 
                   "http://127.0.0.1:5173", "http://localhost:5173",
                   "https://great-readily-quail.ngrok-free.app"]  # Explicitly add the current ngrok URL

# Add ngrok URL to allowed origins if available
if ngrok_url:
    allowed_origins.append(ngrok_url)
    print(f"Allowing CORS for ngrok URL: {ngrok_url}")

print(f"Allowed origins: {allowed_origins}")

# Enhanced CORS configuration with more permissive settings for development
CORS(app, 
     supports_credentials=True, 
     origins=allowed_origins, 
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-User-ID", "Access-Control-Allow-Origin"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
     expose_headers=["Content-Type", "Authorization", "X-User-ID"],
     allow_origin_regex=r"https://.*\.ngrok-free\.app")

# Configure session to work with CORS
app.config.update(
    SESSION_COOKIE_SECURE=False,  # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE=None,  # Allow cross-site cookies
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)  # Extend session lifetime
)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host= os.environ.get("DB_HOST"),
        user= os.environ.get("DB_USER"),
        password= os.environ.get("DB_PASS"),
        database= os.environ.get("DB_NAME")
    )

# Helper to convert DB rows to JSON-friendly format
def format_date(date_obj):
    if isinstance(date_obj, (datetime, date)):
        return date_obj.isoformat()
    return date_obj

# User Authentication
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    print(f"Login attempt for: {email}")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Use plain text password directly - no hashing
        cursor.execute("SELECT id, name, email, role, avatar FROM users WHERE email = %s AND password = %s", 
                      (email, password))
        user = cursor.fetchone()
        cursor.close()
        db.close()
        
        if user:
            session['user_id'] = user['id']
            print(f"Login successful for user ID: {user['id']}, Role: {user['role']}")
            print(f"Session after login: {session}")
            
            # Return user data without manually setting CORS headers (handled by Flask-CORS)
            return jsonify({
                "success": True, 
                "user": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "role": user['role'],
                    "avatar": user['avatar']
                }
            })
        else:
            print(f"Invalid login credentials for: {email}")
            return jsonify({"error": "Invalid credentials"}), 401
    except Error as e:
        print(f"MySQL Error in login: {e}")
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Email already registered"}), 400
        
        # Store password directly - no hashing
        
        # Default role is 'user'
        cursor.execute(
            "INSERT INTO users (name, email, password, role, avatar) VALUES (%s, %s, %s, %s, %s)",
            (name, email, password, 'user', 'default-avatar.png')
        )
        
        db.commit()
        new_user_id = cursor.lastrowid
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Registration successful",
            "user_id": new_user_id
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Registration failed"}), 500

# User Profile Update
@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    # Check if user is logged in
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    name = data.get('name')
    email = data.get('email')
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Get current user data
        cursor.execute("SELECT name, email, password FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        # If password change is requested, verify current password
        if new_password:
            if not current_password:
                cursor.close()
                db.close()
                return jsonify({"error": "Current password is required to change password"}), 400
            
            # Check current password (plain text comparison)
            if current_password != user['password']:
                cursor.close()
                db.close()
                return jsonify({"error": "Current password is incorrect"}), 400
        
        # Build update query
        updates = []
        params = []
        
        if name:
            updates.append("name = %s")
            params.append(name)
        
        if email and email != user['email']:
            # Check if email is already in use by another user
            cursor.execute("SELECT id FROM users WHERE email = %s AND id != %s", (email, user_id))
            if cursor.fetchone():
                cursor.close()
                db.close()
                return jsonify({"error": "Email is already in use"}), 400
            
            updates.append("email = %s")
            params.append(email)
        
        if new_password:
            updates.append("password = %s")
            params.append(new_password)  # Store as plain text
        
        if not updates:
            cursor.close()
            db.close()
            return jsonify({"message": "No changes made"}), 200
        
        # Execute update
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        params.append(user_id)
        cursor.execute(query, tuple(params))
        
        db.commit()
        
        # Get updated user data for response
        cursor.execute("SELECT id, name, email, role, avatar FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()
        
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully",
            "user": {
                "id": str(updated_user['id']),
                "name": updated_user['name'],
                "email": updated_user['email'],
                "role": updated_user['role'],
                "avatar": updated_user['avatar']
            }
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Team Members
@app.route('/api/team', methods=['GET'])
def get_team():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name, role, bio, avatar, email, website, twitter, linkedin FROM team_members")
        members = cursor.fetchall()
        cursor.close()
        db.close()

        team_data = [
            {
                "id": str(member["id"]),
                "name": member["name"],
                "role": member["role"],
                "bio": member["bio"],
                "avatar": member["avatar"],
                "social": {
                    "email": member["email"],
                    "website": member["website"],
                    "twitter": member["twitter"],
                    "linkedin": member["linkedin"]
                }
            }
            for member in members
        ]

        return jsonify(team_data)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database connection failed"}), 500

# Blog Posts
@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Join with users table to get author information
        cursor.execute("""
            SELECT bp.id, bp.title, bp.excerpt, bp.content, bp.published_at, bp.read_time, bp.cover_image,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM blog_posts bp
            JOIN users u ON bp.author_id = u.id
            ORDER BY bp.published_at DESC
        """)
        
        posts = cursor.fetchall()
        
        # Get tags for each post
        formatted_posts = []
        for post in posts:
            cursor.execute("""
                SELECT t.name FROM tags t
                JOIN blog_post_tags bpt ON t.id = bpt.tag_id
                WHERE bpt.blog_post_id = %s
            """, (post['id'],))
            
            tags = [tag['name'] for tag in cursor.fetchall()]
            
            formatted_posts.append({
                "id": str(post['id']),
                "title": post['title'],
                "excerpt": post['excerpt'],
                "content": post['content'],
                "author": {
                    "id": str(post['author_id']),
                    "name": post['author_name'],
                    "avatar": post['author_avatar']
                },
                "publishedAt": format_date(post['published_at']),
                "readTime": post['read_time'],
                "coverImage": post['cover_image'],
                "tags": tags
            })
        
        cursor.close()
        db.close()
        return jsonify(formatted_posts)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database connection failed"}), 500

# Get new blog post template
@app.route('/api/blog/new', methods=['GET'])
def get_new_blog_template():
    # Check if user is logged in
    user_id = session.get('user_id')
    
    # For development - also accept a custom header with user ID
    dev_user_id = request.headers.get('X-User-ID')
    if dev_user_id and not user_id:
        print(f"Using development X-User-ID header for blog template: {dev_user_id}")
        user_id = dev_user_id
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Get the user's info for the template
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("SELECT id, name, avatar, role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        db.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Return an empty blog post template with the user as the author
        return jsonify({
            "id": "new",
            "title": "",
            "excerpt": "",
            "content": "",
            "author": {
                "id": str(user['id']),
                "name": user['name'],
                "avatar": user['avatar']
            },
            "publishedAt": format_date(datetime.now()),
            "readTime": "1 min read",
            "coverImage": "",
            "tags": [],
            "comments": []
        })
    except Error as e:
        print(f"MySQL Error in get_new_blog_template: {e}")
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Get post with author info
        cursor.execute("""
            SELECT bp.id, bp.title, bp.excerpt, bp.content, bp.published_at, bp.read_time, bp.cover_image,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM blog_posts bp
            JOIN users u ON bp.author_id = u.id
            WHERE bp.id = %s
        """, (post_id,))
        
        post = cursor.fetchone()
        
        if not post:
            cursor.close()
            db.close()
            return jsonify({"error": "Post not found"}), 404
        
        # Get tags
        cursor.execute("""
            SELECT t.name FROM tags t
            JOIN blog_post_tags bpt ON t.id = bpt.tag_id
            WHERE bpt.blog_post_id = %s
        """, (post_id,))
        
        tags = [tag['name'] for tag in cursor.fetchall()]
        
        # Get comments
        cursor.execute("""
            SELECT bc.id, bc.content, bc.parent_comment_id, bc.likes, bc.created_at,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM blog_comments bc
            JOIN users u ON bc.author_id = u.id
            WHERE bc.blog_post_id = %s
            ORDER BY bc.created_at
        """, (post_id,))
        
        all_comments = cursor.fetchall()
        
        # Process comments into a nested structure
        comments_by_id = {}
        top_level_comments = []
        
        for comment in all_comments:
            formatted_comment = {
                "id": str(comment['id']),
                "author": {
                    "id": str(comment['author_id']),
                    "name": comment['author_name'],
                    "avatar": comment['author_avatar']
                },
                "content": comment['content'],
                "timestamp": format_date(comment['created_at']),
                "likes": comment['likes'],
                "replies": []
            }
            
            comments_by_id[comment['id']] = formatted_comment
            
            if comment['parent_comment_id'] is None:
                top_level_comments.append(formatted_comment)
            else:
                parent_id = comment['parent_comment_id']
                if parent_id in comments_by_id:
                    comments_by_id[parent_id]['replies'].append(formatted_comment)
        
        # Format the final response
        formatted_post = {
            "id": str(post['id']),
            "title": post['title'],
            "excerpt": post['excerpt'],
            "content": post['content'],
            "author": {
                "id": str(post['author_id']),
                "name": post['author_name'],
                "avatar": post['author_avatar']
            },
            "publishedAt": format_date(post['published_at']),
            "readTime": post['read_time'],
            "coverImage": post['cover_image'],
            "tags": tags,
            "comments": top_level_comments
        }
        
        cursor.close()
        db.close()
        return jsonify(formatted_post)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database connection failed"}), 500

# Blog Post Creation
@app.route('/api/blog', methods=['POST'])
def create_blog_post():
    # Check if user is logged in
    user_id = session.get('user_id')
    print(f"Session user_id for blog creation: {user_id}")
    
    # For development - also accept a custom header with user ID
    dev_user_id = request.headers.get('X-User-ID')
    if dev_user_id and not user_id:
        print(f"Using development X-User-ID header for blog creation: {dev_user_id}")
        user_id = dev_user_id
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    title = data.get('title')
    content = data.get('content')
    excerpt = data.get('excerpt')
    cover_image = data.get('coverImage')
    tags = data.get('tags', [])
    
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check user exists
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        print(f"User ID: {user_id}, Role: {user['role'] if user else 'No role found'}")
        
        if not user:
            cursor.close()
            db.close()
            return jsonify({"error": "User not found"}), 404
            
        # Calculate read time - rough estimate based on word count
        word_count = len(content.split())
        read_time = f"{max(1, round(word_count / 200))} min read"  # Assuming 200 words per minute
        
        try:
            # Insert blog post
            cursor.execute("""
                INSERT INTO blog_posts (title, content, excerpt, author_id, read_time, cover_image) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (title, content, excerpt, user_id, read_time, cover_image))
            
            blog_post_id = cursor.lastrowid
            print(f"Created blog post with ID: {blog_post_id}")
        except Error as e:
            print(f"Error inserting blog post: {e}")
            cursor.close()
            db.close()
            return jsonify({"error": f"Failed to create blog post: {str(e)}"}), 500
        
        # Process tags
        for tag_name in tags:
            # Check if tag exists
            cursor.execute("SELECT id FROM tags WHERE name = %s", (tag_name,))
            tag = cursor.fetchone()
            
            if tag:
                tag_id = tag['id']
            else:
                # Create new tag
                cursor.execute("INSERT INTO tags (name) VALUES (%s)", (tag_name,))
                tag_id = cursor.lastrowid
            
            # Link tag to post
            cursor.execute("""
                INSERT INTO blog_post_tags (blog_post_id, tag_id) 
                VALUES (%s, %s)
            """, (blog_post_id, tag_id))
        
        db.commit()
        
        # Get the author info for the response
        cursor.execute("SELECT name, avatar FROM users WHERE id = %s", (user_id,))
        author = cursor.fetchone()
        
        cursor.close()
        db.close()
        
        return jsonify({
            "id": str(blog_post_id),
            "title": title,
            "excerpt": excerpt,
            "content": content,
            "author": {
                "id": str(user_id),
                "name": author['name'],
                "avatar": author['avatar']
            },
            "publishedAt": format_date(datetime.now()),
            "readTime": read_time,
            "coverImage": cover_image,
            "tags": tags,
            "comments": []
        })
    except Error as e:
        print(f"MySQL Error in create_blog_post: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Blog Comment Creation
@app.route('/api/blog/<int:post_id>/comments', methods=['POST'])
def add_blog_comment(post_id):
    # Check if user is logged in
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    content = data.get('content')
    parent_comment_id = data.get('parentCommentId')
    
    if not content:
        return jsonify({"error": "Comment content is required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if blog post exists
        cursor.execute("SELECT id FROM blog_posts WHERE id = %s", (post_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Blog post not found"}), 404
        
        # Insert comment
        cursor.execute("""
            INSERT INTO blog_comments (blog_post_id, author_id, content, parent_comment_id) 
            VALUES (%s, %s, %s, %s)
        """, (post_id, user_id, content, parent_comment_id))
        
        comment_id = cursor.lastrowid
        
        # Get author info for response
        cursor.execute("SELECT name, avatar FROM users WHERE id = %s", (user_id,))
        author = cursor.fetchone()
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "id": str(comment_id),
            "content": content,
            "author": {
                "id": str(user_id),
                "name": author['name'],
                "avatar": author['avatar']
            },
            "timestamp": format_date(datetime.now()),
            "likes": 0,
            "replies": []
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database error: " + str(e)}), 500

# Events
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT e.id, e.title, e.date, e.description, e.location, e.time, e.capacity,
                   u.name as creator_name,
                   COUNT(er.id) as registered_users
            FROM events e
            LEFT JOIN users u ON e.created_by = u.id
            LEFT JOIN event_registrations er ON e.id = er.event_id
            GROUP BY e.id
            ORDER BY e.date
        """)
        
        events = cursor.fetchall()
        cursor.close()
        db.close()
        
        formatted_events = [
            {
                "id": str(event['id']),
                "title": event['title'],
                "date": format_date(event['date']),
                "time": event['time'] if event['time'] else '',
                "description": event['description'],
                "location": event['location'],
                "capacity": event['capacity'],
                "registeredUsers": event['registered_users'],
                "creator": event['creator_name']
            }
            for event in events
        ]
        
        return jsonify(formatted_events)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database connection failed"}), 500

# Event Creation
@app.route('/api/events', methods=['POST'])
def create_event():
    # Check if user is logged in via session
    user_id = session.get('user_id')
    print(f"Session user_id for event creation: {user_id}")
    
    # For development - also accept a custom header with user ID
    dev_user_id = request.headers.get('X-User-ID')
    if dev_user_id and not user_id:
        print(f"Using development X-User-ID header: {dev_user_id}")
        user_id = dev_user_id
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Handle both form data and JSON data
        if request.is_json:
            data = request.get_json(force=True)
            print(f"JSON data received for event creation: {data}")
        else:
            data = request.form
            print(f"Form data received for event creation: {data}")
        
        # Extract event data with defaults for optional fields
        title = data.get('title')
        description = data.get('description', '')  # Default empty string
        date_str = data.get('date')
        time = data.get('time', '')  # Default empty string
        location = data.get('location')
        capacity = data.get('capacity')
        
        print(f"Parsed event data - Title: {title}, Date: {date_str}, Location: {location}, Capacity: {capacity}")
        
        # Validate required fields
        if not title or not date_str or not location:
            return jsonify({"error": "Title, date, and location are required"}), 400
        
        # Convert capacity to integer with default
        try:
            capacity = int(capacity) if capacity else 50  # Default to 50 if not provided
        except ValueError:
            capacity = 50  # Default to 50 if conversion fails
            
        # Parse date from string
        try:
            # Handle different date formats including those with 'T' separator
            if isinstance(date_str, str):
                if 'T' in date_str:
                    date_str = date_str.split('T')[0]  # Extract date part from ISO format
                event_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            else:
                event_date = date_str
            print(f"Parsed date: {event_date}")
        except ValueError as e:
            print(f"Date parsing error: {e}")
            return jsonify({"error": f"Invalid date format. Please use YYYY-MM-DD format."}), 400
        
        # Get database connection
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        try:
            # Get user info
            cursor.execute("SELECT id, name, role FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            
            if not user:
                cursor.close()
                db.close()
                return jsonify({"error": "User not found"}), 404
            
            print(f"Event Creation by: User ID: {user_id}, Name: {user.get('name')}, Role: {user.get('role')}")
            
            # Insert event
            insert_query = """
                INSERT INTO events (title, description, date, time, location, capacity, created_by) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            insert_params = (title, description, event_date, time, location, capacity, user_id)
            print(f"Insert query: {insert_query}")
            print(f"Parameters: {insert_params}")
            
            cursor.execute(insert_query, insert_params)
            
            # Get the event ID and commit immediately to ensure it's saved
            event_id = cursor.lastrowid
            db.commit()
            
            print(f"Created event with ID: {event_id}")
            
            # Create response object
            response_data = {
                "id": str(event_id),
                "title": title,
                "description": description,
                "date": format_date(event_date),
                "time": time,
                "location": location,
                "capacity": capacity,
                "registeredUsers": 0,
                "creator": user.get('name')
            }
            
            print(f"Event creation successful. Returning: {response_data}")
            cursor.close()
            db.close()
            return jsonify(response_data)
            
        except Error as e:
            print(f"Database error in create_event: {e}")
            cursor.close()
            db.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500
            
    except Exception as e:
        print(f"Unexpected error in create_event: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Event Registration
@app.route('/api/events/<int:event_id>/register', methods=['POST'])
def register_for_event(event_id):
    # Check if user is logged in
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if event exists
        cursor.execute("SELECT id, capacity FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()
        if not event:
            cursor.close()
            db.close()
            return jsonify({"error": "Event not found"}), 404
        
        # Check if already registered
        cursor.execute("""
            SELECT id FROM event_registrations 
            WHERE event_id = %s AND user_id = %s
        """, (event_id, user_id))
        
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "You are already registered for this event"}), 400
        
        # Check if event is full
        cursor.execute("""
            SELECT COUNT(*) as registered_count 
            FROM event_registrations 
            WHERE event_id = %s
        """, (event_id,))
        
        registration_count = cursor.fetchone()['registered_count']
        if registration_count >= event['capacity']:
            cursor.close()
            db.close()
            return jsonify({"error": "Event is at full capacity"}), 400
        
        # Register for the event
        cursor.execute("""
            INSERT INTO event_registrations (event_id, user_id) 
            VALUES (%s, %s)
        """, (event_id, user_id))
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Successfully registered for the event",
            "registeredUsers": registration_count + 1
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database error: " + str(e)}), 500

# Event Unregistration
@app.route('/api/events/<int:event_id>/unregister', methods=['POST'])
def unregister_from_event(event_id):
    # Check if user is logged in
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if event exists
        cursor.execute("SELECT id FROM events WHERE id = %s", (event_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Event not found"}), 404
        
        # Check if registered
        cursor.execute("""
            SELECT id FROM event_registrations 
            WHERE event_id = %s AND user_id = %s
        """, (event_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "You are not registered for this event"}), 400
        
        # Get current registration count
        cursor.execute("""
            SELECT COUNT(*) as registered_count 
            FROM event_registrations 
            WHERE event_id = %s
        """, (event_id,))
        
        registration_count = cursor.fetchone()['registered_count']
        
        # Unregister from the event
        cursor.execute("""
            DELETE FROM event_registrations 
            WHERE event_id = %s AND user_id = %s
        """, (event_id, user_id))
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Successfully unregistered from the event",
            "registeredUsers": registration_count - 1
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database error: " + str(e)}), 500

# Get Event Registrations for User
@app.route('/api/events/registrations', methods=['GET'])
def get_user_event_registrations():
    # Check if user is logged in
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT er.event_id as eventId
            FROM event_registrations er
            WHERE er.user_id = %s
        """, (user_id,))
        
        registrations = cursor.fetchall()
        cursor.close()
        db.close()
        
        return jsonify(registrations)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Database error: " + str(e)}), 500

# Forum Posts
@app.route('/api/forum', methods=['GET'])
def get_forum_posts():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT fp.id, fp.title, fp.content, fp.created_at,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar,
                   COUNT(fr.id) as reply_count
            FROM forum_posts fp
            JOIN users u ON fp.author_id = u.id
            LEFT JOIN forum_replies fr ON fp.id = fr.forum_post_id
            GROUP BY fp.id
            ORDER BY fp.created_at DESC
        """)
        
        posts = cursor.fetchall()
        cursor.close()
        db.close()
        
        formatted_posts = []
        for post in posts:
            formatted_posts.append({
                "id": str(post['id']),
                "title": post['title'],
                "content": post['content'],
                "timestamp": format_date(post['created_at']),
                "author": {
                    "id": str(post['author_id']),
                    "name": post['author_name'],
                    "avatar": post['author_avatar']
                },
                "replies": post['reply_count']
            })
        
        print(f"Retrieved {len(formatted_posts)} forum posts")
        return jsonify(formatted_posts)
    except Error as e:
        print(f"MySQL Error in get_forum_posts: {e}")
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/forum/<int:post_id>', methods=['GET'])
def get_forum_post(post_id):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        print(f"Fetching forum post ID: {post_id}")
        
        # Get post with author info
        cursor.execute("""
            SELECT fp.id, fp.title, fp.content, fp.created_at,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM forum_posts fp
            JOIN users u ON fp.author_id = u.id
            WHERE fp.id = %s
        """, (post_id,))
        
        post = cursor.fetchone()
        
        if not post:
            cursor.close()
            db.close()
            print(f"Forum post ID {post_id} not found")
            return jsonify({"error": "Post not found"}), 404
        
        # Get replies
        cursor.execute("""
            SELECT fr.id, fr.content, fr.created_at,
                   u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM forum_replies fr
            JOIN users u ON fr.author_id = u.id
            WHERE fr.forum_post_id = %s
            ORDER BY fr.created_at
        """, (post_id,))
        
        replies = cursor.fetchall()
        
        formatted_replies = []
        for reply in replies:
            formatted_replies.append({
                "id": str(reply['id']),
                "content": reply['content'],
                "timestamp": format_date(reply['created_at']),
                "author": {
                    "id": str(reply['author_id']),
                    "name": reply['author_name'],
                    "avatar": reply['author_avatar']
                }
            })
        
        print(f"Found {len(formatted_replies)} replies for forum post ID {post_id}")
        
        formatted_post = {
            "id": str(post['id']),
            "title": post['title'],
            "content": post['content'],
            "timestamp": format_date(post['created_at']),
            "author": {
                "id": str(post['author_id']),
                "name": post['author_name'],
                "avatar": post['author_avatar']
            },
            "replies": formatted_replies
        }
        
        return jsonify(formatted_post)
    except Error as e:
        print(f"MySQL Error in get_forum_post: {e}")
        return jsonify({"error": "Database connection failed"}), 500

# Forum Post Creation
@app.route('/api/forum', methods=['POST'])
def create_forum_post():
    # Check if user is logged in
    user_id = session.get('user_id')
    print(f"Session user_id for forum post creation: {user_id}")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    title = data.get('title')
    content = data.get('content')
    
    print(f"Attempting to create forum post: User ID: {user_id}, Title: {title}")
    
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Insert forum post
        try:
            cursor.execute("""
                INSERT INTO forum_posts (title, content, author_id) 
                VALUES (%s, %s, %s)
            """, (title, content, user_id))
            
            post_id = cursor.lastrowid
            print(f"Created forum post with ID: {post_id}")
        except Error as e:
            print(f"Error inserting forum post: {e}")
            cursor.close()
            db.close()
            return jsonify({"error": f"Failed to create forum post: {str(e)}"}), 500
        
        # Get author info for the response
        cursor.execute("SELECT name, avatar FROM users WHERE id = %s", (user_id,))
        author = cursor.fetchone()
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "id": str(post_id),
            "title": title,
            "content": content,
            "timestamp": format_date(datetime.now()),
            "author": {
                "id": str(user_id),
                "name": author['name'],
                "avatar": author['avatar']
            },
            "replies": 0
        })
    except Error as e:
        print(f"MySQL Error in create_forum_post: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Forum Reply Creation
@app.route('/api/forum/<int:post_id>/replies', methods=['POST'])
def add_forum_reply(post_id):
    # Check if user is logged in
    user_id = session.get('user_id')
    print(f"Session user_id for forum reply: {user_id}")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    content = data.get('content')
    
    print(f"Attempting to add reply to forum post {post_id}: User ID: {user_id}, Content: {content[:50]}...")
    
    if not content:
        return jsonify({"error": "Reply content is required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if forum post exists
        cursor.execute("SELECT id FROM forum_posts WHERE id = %s", (post_id,))
        post = cursor.fetchone()
        if not post:
            cursor.close()
            db.close()
            print(f"Forum post ID {post_id} not found when trying to add reply")
            return jsonify({"error": "Forum post not found"}), 404
        
        # Insert reply
        try:
            cursor.execute("""
                INSERT INTO forum_replies (forum_post_id, author_id, content) 
                VALUES (%s, %s, %s)
            """, (post_id, user_id, content))
            
            reply_id = cursor.lastrowid
            print(f"Created forum reply with ID: {reply_id}")
        except Error as e:
            print(f"Error inserting forum reply: {e}")
            cursor.close()
            db.close()
            return jsonify({"error": f"Failed to create forum reply: {str(e)}"}), 500
        
        # Get author info for response
        cursor.execute("SELECT name, avatar FROM users WHERE id = %s", (user_id,))
        author = cursor.fetchone()
        
        db.commit()
        cursor.close()
        db.close()
        
        response_data = {
            "id": str(reply_id),
            "content": content,
            "timestamp": format_date(datetime.now()),
            "author": {
                "id": str(user_id),
                "name": author['name'],
                "avatar": author['avatar']
            }
        }
        print(f"Sending forum reply response: {response_data}")
        
        return jsonify(response_data)
    except Error as e:
        print(f"MySQL Error in add_forum_reply: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Contact Form
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        cursor.execute(
            "INSERT INTO contact_submissions (name, email, subject, message) VALUES (%s, %s, %s, %s)",
            (name, email, subject, message)
        )
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({"success": True, "message": "Contact form submitted successfully"})
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to submit contact form"}), 500

# User Management API - Admin only
@app.route('/api/users', methods=['GET'])
def get_users():
    # Check if user is logged in and is an admin
    user_id = session.get('user_id')
    test_user_id = request.headers.get('X-User-ID')
    
    # For test/development, allow X-User-ID header to override session
    if test_user_id:
        user_id = test_user_id
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user has admin role
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin access required"}), 403
        
        # Fetch all users
        cursor.execute("SELECT id, name, email, role, avatar, created_at as joinDate FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        # Process dates to ensure JSON serialization
        for user in users:
            if 'joinDate' in user and user['joinDate']:
                user['joinDate'] = format_date(user['joinDate'])
        
        cursor.close()
        db.close()
        
        return jsonify(users)
    except Error as e:
        print(f"MySQL Error in get_users: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    # Check if user is logged in and is an admin
    session_user_id = session.get('user_id')
    test_user_id = request.headers.get('X-User-ID')
    
    # For test/development, allow X-User-ID header to override session
    if test_user_id:
        session_user_id = test_user_id
    
    if not session_user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # If user is not admin and not viewing their own profile, deny access
        cursor.execute("SELECT role FROM users WHERE id = %s", (session_user_id,))
        user_role = cursor.fetchone()
        
        if (not user_role or user_role['role'] != 'admin') and session_user_id != user_id:
            cursor.close()
            db.close()
            return jsonify({"error": "Admin access required or can only view your own profile"}), 403
        
        # Fetch the requested user
        cursor.execute("SELECT id, name, email, role, avatar, created_at as joinDate FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        # Process dates for JSON
        if 'joinDate' in user and user['joinDate']:
            user['joinDate'] = format_date(user['joinDate'])
        
        cursor.close()
        db.close()
        
        return jsonify(user)
    except Error as e:
        print(f"MySQL Error in get_user: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    # Check if user is logged in and is an admin
    user_id = session.get('user_id')
    test_user_id = request.headers.get('X-User-ID')
    
    # For test/development, allow X-User-ID header to override session
    if test_user_id:
        user_id = test_user_id
    
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')  # Default to 'user' if not specified
    avatar = data.get('avatar', 'default-avatar.png')
    
    # Validate required fields
    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    
    # Validate role
    valid_roles = ['user', 'editor', 'admin']
    if role not in valid_roles:
        return jsonify({"error": "Invalid role. Must be one of: user, editor, admin"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user has admin role
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin access required"}), 403
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Email already registered"}), 400
        
        # Create the new user
        cursor.execute(
            "INSERT INTO users (name, email, password, role, avatar) VALUES (%s, %s, %s, %s, %s)",
            (name, email, password, role, avatar)
        )
        
        db.commit()
        new_user_id = cursor.lastrowid
        
        # Fetch the created user for response
        cursor.execute("SELECT id, name, email, role, avatar, created_at as joinDate FROM users WHERE id = %s", (new_user_id,))
        new_user = cursor.fetchone()
        
        # Process dates for JSON
        if 'joinDate' in new_user and new_user['joinDate']:
            new_user['joinDate'] = format_date(new_user['joinDate'])
        
        cursor.close()
        db.close()
        
        return jsonify(new_user)
    except Error as e:
        print(f"MySQL Error in create_user: {e}")
        return jsonify({"error": "Failed to create user"}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    # Check if user is logged in and is an admin
    session_user_id = session.get('user_id')
    test_user_id = request.headers.get('X-User-ID')
    
    # For test/development, allow X-User-ID header to override session
    if test_user_id:
        session_user_id = test_user_id
    
    if not session_user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')  # Optional - only update if provided
    role = data.get('role')
    avatar = data.get('avatar')
    
    # Validate required fields
    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400
    
    # Validate role if provided
    if role:
        valid_roles = ['user', 'editor', 'admin']
        if role not in valid_roles:
            return jsonify({"error": "Invalid role. Must be one of: user, editor, admin"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user has admin role
        cursor.execute("SELECT role FROM users WHERE id = %s", (session_user_id,))
        user_role = cursor.fetchone()
        
        # Only admin can update other users, or users can update their own profile
        if (not user_role or user_role['role'] != 'admin') and session_user_id != user_id:
            cursor.close()
            db.close()
            return jsonify({"error": "Admin access required or can only update your own profile"}), 403
        
        # Check if email already exists for a different user
        cursor.execute("SELECT id FROM users WHERE email = %s AND id != %s", (email, user_id))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Email already registered to another user"}), 400
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        # Build the update query dynamically based on what fields are provided
        update_fields = []
        update_values = []
        
        update_fields.append("name = %s")
        update_values.append(name)
        
        update_fields.append("email = %s")
        update_values.append(email)
        
        if password:
            update_fields.append("password = %s")
            update_values.append(password)
        
        if role:
            # Non-admin users can't change their own role
            if user_role['role'] != 'admin' and session_user_id == user_id:
                cursor.close()
                db.close()
                return jsonify({"error": "Cannot change your own role"}), 403
            
            update_fields.append("role = %s")
            update_values.append(role)
        
        if avatar:
            update_fields.append("avatar = %s")
            update_values.append(avatar)
        
        # Add user_id to values for WHERE clause
        update_values.append(user_id)
        
        # Execute the update
        cursor.execute(
            f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s",
            tuple(update_values)
        )
        
        db.commit()
        
        # Fetch the updated user for response
        cursor.execute("SELECT id, name, email, role, avatar, created_at as joinDate FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()
        
        # Process dates for JSON
        if 'joinDate' in updated_user and updated_user['joinDate']:
            updated_user['joinDate'] = format_date(updated_user['joinDate'])
        
        cursor.close()
        db.close()
        
        return jsonify(updated_user)
    except Error as e:
        print(f"MySQL Error in update_user: {e}")
        return jsonify({"error": "Failed to update user"}), 500

@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Check if user is logged in and is an admin
    session_user_id = session.get('user_id')
    test_user_id = request.headers.get('X-User-ID')
    
    # For test/development, allow X-User-ID header to override session
    if test_user_id:
        session_user_id = test_user_id
    
    if not session_user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    # Prevent users from deleting themselves
    if session_user_id == user_id:
        return jsonify({"error": "Cannot delete your own account"}), 403
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user has admin role
        cursor.execute("SELECT role FROM users WHERE id = %s", (session_user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin access required"}), 403
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        # Delete the user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        db.commit()
        
        cursor.close()
        db.close()
        
        return jsonify({"success": True, "message": "User deleted successfully"})
    except Error as e:
        print(f"MySQL Error in delete_user: {e}")
        return jsonify({"error": "Failed to delete user"}), 500

# Contact Request API Endpoints
@app.route('/api/contact-requests', methods=['GET'])
def get_contact_requests():
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is admin
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        
        # Check if user is admin
        auth_cursor = db.cursor(dictionary=True)
        auth_cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = auth_cursor.fetchone()
        auth_cursor.close()
        
        if not user or user['role'] != 'admin':
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Check if status column exists and add it if it doesn't
        check_cursor = db.cursor()
        try:
            check_cursor.execute("SELECT status FROM contact_submissions LIMIT 1")
            # Make sure to fetch any results to avoid "unread result" errors
            check_cursor.fetchall()
        except Error:
            print("Adding status column to contact_submissions table")
            check_cursor.execute("ALTER TABLE contact_submissions ADD COLUMN status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new'")
            db.commit()
        check_cursor.close()
        
        # Get all contact submissions with a fresh cursor
        data_cursor = db.cursor(dictionary=True)
        data_cursor.execute("""
            SELECT id, name, email, subject, message, created_at, 
                   CASE 
                       WHEN status = 'archived' THEN 'archived'
                       WHEN status = 'replied' THEN 'replied'
                       WHEN is_read = 1 THEN 'read'
                       ELSE 'new'
                   END as status
            FROM contact_submissions
            ORDER BY created_at DESC
        """)
        contact_requests = data_cursor.fetchall()
        
        # Convert datetime objects to strings
        for contact in contact_requests:
            contact['created_at'] = format_date(contact['created_at'])
        
        data_cursor.close()
        db.close()
        
        return jsonify(contact_requests)
    except Error as e:
        print(f"MySQL Error: {e}")
        if db:
            db.close()
        return jsonify({"error": "Failed to fetch contact requests"}), 500

@app.route('/api/contact-requests', methods=['POST'])
def submit_contact_request():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Please provide a valid email address"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # Add a column for status if it doesn't exist
        try:
            cursor.execute("SELECT status FROM contact_submissions LIMIT 1")
        except Error:
            print("Adding status column to contact_submissions table")
            cursor.execute("ALTER TABLE contact_submissions ADD COLUMN status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new'")
            db.commit()
        
        # Insert the contact request
        cursor.execute(
            "INSERT INTO contact_submissions (name, email, subject, message, created_at, is_read, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, email, subject, message, datetime.now(), 0, 'new')
        )
        
        db.commit()
        new_id = cursor.lastrowid
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "id": new_id,
            "message": "Contact request submitted successfully"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to submit contact request"}), 500

@app.route('/api/contact-requests/<int:request_id>', methods=['PATCH'])
def update_contact_request(request_id):
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is authenticated
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    status = data.get('status')
    
    if not status or status not in ['read', 'replied', 'archived']:
        return jsonify({"error": "Valid status is required (read, replied, or archived)"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user or user['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Check if contact request exists
        cursor.execute("SELECT id FROM contact_submissions WHERE id = %s", (request_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Contact request not found"}), 404
        
        # Update the contact request status
        if status == 'read':
            cursor.execute(
                "UPDATE contact_submissions SET is_read = 1, status = 'read' WHERE id = %s",
                (request_id,)
            )
        else:
            cursor.execute(
                "UPDATE contact_submissions SET status = %s WHERE id = %s",
                (status, request_id)
            )
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": f"Contact request status updated to {status}"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to update contact request"}), 500

@app.route('/api/contact-requests/<int:request_id>', methods=['DELETE'])
def delete_contact_request(request_id):
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is authenticated
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user or user['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Check if contact request exists
        cursor.execute("SELECT id FROM contact_submissions WHERE id = %s", (request_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Contact request not found"}), 404
        
        # Delete the contact request
        cursor.execute("DELETE FROM contact_submissions WHERE id = %s", (request_id,))
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Contact request deleted successfully"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to delete contact request"}), 500

# Team Members API Endpoints
@app.route('/api/team-members', methods=['GET'])
def get_team_members():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, name, role, bio, avatar, email as social_email, 
                   website as social_website, twitter as social_twitter, 
                   linkedin as social_linkedin, created_at, updated_at 
            FROM team_members
            ORDER BY id ASC
        """)
        
        team_members = cursor.fetchall()
        
        # Convert datetime objects to strings and restructure for frontend
        formatted_members = []
        for member in team_members:
            formatted_member = {
                'id': member['id'],
                'name': member['name'],
                'role': member['role'],
                'bio': member['bio'],
                'avatar': member['avatar'],
                'social': {
                    'email': member['social_email'] or '',
                    'website': member['social_website'] or '#',
                    'twitter': member['social_twitter'] or '#',
                    'linkedin': member['social_linkedin'] or '#'
                }
            }
            formatted_members.append(formatted_member)
        
        cursor.close()
        db.close()
        
        return jsonify(formatted_members)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to fetch team members"}), 500

@app.route('/api/team-members/<int:member_id>', methods=['GET'])
def get_team_member(member_id):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, name, role, bio, avatar, email as social_email, 
                   website as social_website, twitter as social_twitter, 
                   linkedin as social_linkedin, created_at, updated_at 
            FROM team_members
            WHERE id = %s
        """, (member_id,))
        
        member = cursor.fetchone()
        
        if not member:
            cursor.close()
            db.close()
            return jsonify({"error": "Team member not found"}), 404
        
        # Convert datetime objects to strings and restructure for frontend
        formatted_member = {
            'id': member['id'],
            'name': member['name'],
            'role': member['role'],
            'bio': member['bio'],
            'avatar': member['avatar'],
            'social': {
                'email': member['social_email'] or '',
                'website': member['social_website'] or '#',
                'twitter': member['social_twitter'] or '#',
                'linkedin': member['social_linkedin'] or '#'
            }
        }
        
        cursor.close()
        db.close()
        
        return jsonify(formatted_member)
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to fetch team member"}), 500

@app.route('/api/team-members', methods=['POST'])
def create_team_member():
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is authenticated
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    name = data.get('name')
    role = data.get('role')
    bio = data.get('bio')
    avatar = data.get('avatar')
    social = data.get('social', {})
    
    if not name or not role:
        return jsonify({"error": "Name and role are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user or user['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Insert the team member
        cursor.execute(
            """
            INSERT INTO team_members 
                (name, role, bio, avatar, email, website, twitter, linkedin, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                name, 
                role, 
                bio or '', 
                avatar or 'https://ui-avatars.com/api/?name=' + name.replace(' ', '+'),
                social.get('email', ''),
                social.get('website', '#'),
                social.get('twitter', '#'),
                social.get('linkedin', '#'),
                datetime.now()
            )
        )
        
        db.commit()
        new_id = cursor.lastrowid
        
        # Fetch the newly created team member
        cursor.execute("""
            SELECT id, name, role, bio, avatar, email as social_email, 
                   website as social_website, twitter as social_twitter, 
                   linkedin as social_linkedin, created_at, updated_at 
            FROM team_members
            WHERE id = %s
        """, (new_id,))
        
        member = cursor.fetchone()
        
        # Convert datetime objects to strings and restructure for frontend
        formatted_member = {
            'id': member['id'],
            'name': member['name'],
            'role': member['role'],
            'bio': member['bio'],
            'avatar': member['avatar'],
            'social': {
                'email': member['social_email'] or '',
                'website': member['social_website'] or '#',
                'twitter': member['social_twitter'] or '#',
                'linkedin': member['social_linkedin'] or '#'
            }
        }
        
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "member": formatted_member,
            "message": "Team member created successfully"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to create team member"}), 500

@app.route('/api/team-members/<int:member_id>', methods=['PUT'])
def update_team_member(member_id):
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is authenticated
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.json
    name = data.get('name')
    role = data.get('role')
    bio = data.get('bio')
    avatar = data.get('avatar')
    social = data.get('social', {})
    
    if not name or not role:
        return jsonify({"error": "Name and role are required"}), 400
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user or user['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Check if team member exists
        cursor.execute("SELECT id FROM team_members WHERE id = %s", (member_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Team member not found"}), 404
        
        # Update the team member
        cursor.execute(
            """
            UPDATE team_members 
            SET name = %s, role = %s, bio = %s, avatar = %s, 
                email = %s, website = %s, twitter = %s, linkedin = %s, 
                updated_at = %s
            WHERE id = %s
            """,
            (
                name, 
                role, 
                bio or '', 
                avatar or 'https://ui-avatars.com/api/?name=' + name.replace(' ', '+'),
                social.get('email', ''),
                social.get('website', '#'),
                social.get('twitter', '#'),
                social.get('linkedin', '#'),
                datetime.now(),
                member_id
            )
        )
        
        db.commit()
        
        # Fetch the updated team member
        cursor.execute("""
            SELECT id, name, role, bio, avatar, email as social_email, 
                   website as social_website, twitter as social_twitter, 
                   linkedin as social_linkedin, created_at, updated_at 
            FROM team_members
            WHERE id = %s
        """, (member_id,))
        
        member = cursor.fetchone()
        
        # Convert datetime objects to strings and restructure for frontend
        formatted_member = {
            'id': member['id'],
            'name': member['name'],
            'role': member['role'],
            'bio': member['bio'],
            'avatar': member['avatar'],
            'social': {
                'email': member['social_email'] or '',
                'website': member['social_website'] or '#',
                'twitter': member['social_twitter'] or '#',
                'linkedin': member['social_linkedin'] or '#'
            }
        }
        
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "member": formatted_member,
            "message": "Team member updated successfully"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to update team member"}), 500

@app.route('/api/team-members/<int:member_id>', methods=['DELETE'])
def delete_team_member(member_id):
    # Get user from session or X-User-ID header
    user_id = session.get('user_id')
    if not user_id and request.headers.get('X-User-ID'):
        user_id = request.headers.get('X-User-ID')
    
    # Check if user is authenticated
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        
        # Check if user is admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user or user['role'] != 'admin':
            cursor.close()
            db.close()
            return jsonify({"error": "Admin privileges required"}), 403
        
        # Check if team member exists
        cursor.execute("SELECT id FROM team_members WHERE id = %s", (member_id,))
        if not cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Team member not found"}), 404
        
        # Delete the team member
        cursor.execute("DELETE FROM team_members WHERE id = %s", (member_id,))
        db.commit()
        
        cursor.close()
        db.close()
        
        return jsonify({
            "success": True,
            "message": "Team member deleted successfully"
        })
    except Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"error": "Failed to delete team member"}), 500

# Serve React App - root route and all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path=''):
    # If the path exists as a static file, serve it
    # Otherwise, serve index.html to let React Router handle it
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/club-registration', methods=['POST'])
def submit_club_registration():
    """
    Submit a new club registration
    """
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.json
        
        # Validate required fields
        required_fields = ['fullName', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Process clubs array into comma-separated string
        clubs = data.get('clubs', [])
        clubs_str = ','.join(clubs) if clubs else ''
        
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT id FROM club_registrations WHERE email = %s", (data['email'],))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return jsonify({"error": "A registration with this email already exists"}), 400
        
        # Insert new registration
        query = """
        INSERT INTO club_registrations (
            form_no, registration_no, full_name, date_of_birth, place_of_birth,
            gender, blood_group, religion, address, phone_no, email,
            guardian_name, guardian_mobile, school_name, class1, gpa1,
            class2, gpa2, hobby, correspondence, past_participant, why_join, clubs
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.execute(query, (
            data.get('formNo', ''),
            data.get('registrationNo', ''),
            data['fullName'],
            data.get('dateOfBirth', None),
            data.get('placeOfBirth', ''),
            data.get('gender', ''),
            data.get('bloodGroup', ''),
            data.get('religion', ''),
            data.get('address', ''),
            data.get('phoneNo', ''),
            data['email'],
            data.get('guardianName', ''),
            data.get('guardianMobile', ''),
            data.get('schoolName', ''),
            data.get('class1', ''),
            data.get('gpa1', ''),
            data.get('class2', ''),
            data.get('gpa2', ''),
            data.get('hobby', ''),
            data.get('correspondence', ''),
            data.get('pastParticipant', ''),
            data.get('whyJoin', ''),
            clubs_str
        ))
        
        conn.commit()
        registration_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "Registration submitted successfully",
            "id": registration_id
        }), 201
        
    except Exception as e:
        print(f"Error in club registration: {str(e)}")
        return jsonify({"error": "Failed to submit registration"}), 500

@app.route('/api/club-registration', methods=['GET'])
@login_required
@admin_required
def get_club_registrations():
    """
    Get all club registrations (admin only)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM club_registrations ORDER BY created_at DESC")
        registrations = cursor.fetchall()
        conn.close()
        
        # Process clubs string back to array
        for reg in registrations:
            if reg['clubs']:
                reg['clubs'] = reg['clubs'].split(',')
            else:
                reg['clubs'] = []
                
            # Format dates for JSON
            if reg['date_of_birth']:
                reg['date_of_birth'] = reg['date_of_birth'].isoformat()
            if reg['created_at']:
                reg['created_at'] = reg['created_at'].isoformat()
            if reg['updated_at']:
                reg['updated_at'] = reg['updated_at'].isoformat()
        
        return jsonify(registrations), 200
        
    except Exception as e:
        print(f"Error fetching club registrations: {str(e)}")
        return jsonify({"error": "Failed to fetch registrations"}), 500

@app.route('/api/club-registration/<int:registration_id>', methods=['GET'])
@login_required
@admin_required
def get_club_registration(registration_id):
    """
    Get a specific club registration (admin only)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM club_registrations WHERE id = %s", (registration_id,))
        registration = cursor.fetchone()
        conn.close()
        
        if not registration:
            return jsonify({"error": "Registration not found"}), 404
            
        # Process clubs string back to array
        if registration['clubs']:
            registration['clubs'] = registration['clubs'].split(',')
        else:
            registration['clubs'] = []
            
        # Format dates for JSON
        if registration['date_of_birth']:
            registration['date_of_birth'] = registration['date_of_birth'].isoformat()
        if registration['created_at']:
            registration['created_at'] = registration['created_at'].isoformat()
        if registration['updated_at']:
            registration['updated_at'] = registration['updated_at'].isoformat()
        
        return jsonify(registration), 200
        
    except Exception as e:
        print(f"Error fetching club registration: {str(e)}")
        return jsonify({"error": "Failed to fetch registration"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
