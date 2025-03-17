import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { PageLoader } from './components/PageLoader';
import { CreateBlogPost } from './components/CreateBlogPost';
import { ForumDetail } from './components/ForumDetail';
import { UserForm } from './components/UserForm';
import { EditorPanel } from './components/EditorPanel';
import type { BlogPost as BlogPostType, User } from './types';

// Code splitting - lazy load non-essential components
const Hero = lazy(() => import('./components/Hero').then(module => ({ default: module.Hero })));
const Events = lazy(() => import('./components/Calendar').then(module => ({ default: module.Calendar })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const Profile = lazy(() => import('./components/Profile').then(module => ({ default: module.Profile })));
const Forum = lazy(() => import('./components/Forum').then(module => ({ default: module.Forum })));
const Login = lazy(() => import('./components/Login').then(module => ({ default: module.Login })));
const ClubRegistration = lazy(() => import('./components/ClubRegistration'));
const BlogList = lazy(() => import('./components/BlogList').then(module => ({ default: module.BlogList })));
const BlogPost = lazy(() => import('./components/BlogPost').then(module => ({ default: module.BlogPost })));
const AboutUs = lazy(() => import('./components/AboutUs').then(module => ({ default: module.AboutUs })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));

// Simple component to handle route transitions
function RouteTransition() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return <Outlet />;
}

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'editor', 'admin']
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar />
          <main className="flex-grow pt-20">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<RouteTransition />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Hero />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/register" element={<ClubRegistration />} />
                  
                  {/* Direct route to the new CreateBlogPost component */}
                  <Route
                    path="/create-blog"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <CreateBlogPost />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Protected Route for Blog Creation - Requires editor or admin */}
                  <Route
                    path="/blog/new"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <BlogPost />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* This route must come after more specific routes */}
                  <Route path="/blog/:id" element={<BlogPost />} />

                  {/* Protected Routes - Requires any authenticated user */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/forum"
                    element={
                      <ProtectedRoute>
                        <Forum />
                      </ProtectedRoute>
                    }
                  />
                  {/* Forum post detail route */}
                  <Route
                    path="/forum/:postId"
                    element={
                      <ProtectedRoute>
                        <ForumDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Route for Events - Only accessible via Admin Panel now */}
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Events />
                      </ProtectedRoute>
                    }
                  />

                  {/* Editor Panel Route */}
                  <Route
                    path="/editor"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <EditorPanel />
                      </ProtectedRoute>
                    }
                  />

                  {/* Editor Routes for Content Management */}
                  <Route
                    path="/editor/create-event"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <CreateBlogPost />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/editor/edit-event/:eventId"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <CreateBlogPost />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/editor/edit-blog/:postId"
                    element={
                      <ProtectedRoute allowedRoles={['editor', 'admin']}>
                        <CreateBlogPost />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin User Management Routes */}
                  <Route
                    path="/admin/add-user"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserForm mode="add" />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/admin/edit-user/:userId"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserForm mode="edit" />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin Event Management Routes */}
                  <Route
                    path="/admin/create-event"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Events />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/admin/edit-event/:eventId"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Events />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
