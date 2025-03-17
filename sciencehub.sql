-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 13, 2025 at 02:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sciencehub`
--
CREATE DATABASE IF NOT EXISTS `sciencehub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sciencehub`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','researcher','editor','moderator','admin') DEFAULT 'user',
  `status` enum('active','muted','banned','suspended') DEFAULT 'active',
  `avatar` varchar(255) DEFAULT 'default-avatar.png',
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `status_until` timestamp NULL DEFAULT NULL,
  `status_reason` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `avatar`, `bio`, `created_at`, `last_login`, `status_until`, `status_reason`) VALUES
(1, 'Admin User', 'admin@example.com', 'admin123', 'admin', 'active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', 'System Administrator', current_timestamp(), NULL, NULL, NULL),
(2, 'Editor User', 'editor@example.com', 'editor123', 'editor', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', 'Content Editor', current_timestamp(), NULL, NULL, NULL),
(3, 'Moderator User', 'moderator@example.com', 'mod123', 'moderator', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', 'Community Moderator', current_timestamp(), NULL, NULL, NULL),
(4, 'Researcher User', 'researcher@example.com', 'res123', 'researcher', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', 'Research Team Member', current_timestamp(), NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role`, `bio`, `avatar`, `email`, `website`, `twitter`, `linkedin`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Jane Smith', 'Faculty Advisor', 'Professor of Quantum Physics with over 15 years of research experience', 'https://randomuser.me/api/portraits/women/22.jpg', 'jane.smith@university.edu', 'https://janesmith.edu', '@drjanesmith', 'linkedin.com/in/janesmith', current_timestamp(), current_timestamp()),
(2, 'Alex Johnson', 'President', 'Senior majoring in Astrophysics with a passion for space exploration', 'https://randomuser.me/api/portraits/men/32.jpg', 'alex.johnson@student.edu', '', '@alexj', 'linkedin.com/in/alexjohnson', current_timestamp(), current_timestamp()),
(3, 'Maria Garcia', 'Vice President', 'Junior studying Molecular Biology with research focus on CRISPR technologies', 'https://randomuser.me/api/portraits/women/45.jpg', 'maria.garcia@student.edu', 'mariagarcia.com', '@mariag', 'linkedin.com/in/mariagarcia', current_timestamp(), current_timestamp()),
(4, 'Dr. Sarah Chen', 'Research Lead', 'Dr. Chen is a leading expert in quantum computing and artificial intelligence. She has published numerous papers in top-tier journals and leads our quantum computing research initiative.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', 'sarah.chen@example.com', 'https://example.com/sarah-chen', 'sarahchen', 'sarah-chen', current_timestamp(), current_timestamp()),
(5, 'Prof. James Wilson', 'Senior Scientist', 'Professor Wilson specializes in molecular biology and genetics. His research focuses on understanding the mechanisms of gene regulation and their implications for human health.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', 'james.wilson@example.com', 'https://example.com/james-wilson', 'jameswilson', 'james-wilson', current_timestamp(), current_timestamp()),
(6, 'Dr. Maria Rodriguez', 'Data Scientist', 'Dr. Rodriguez is an expert in data analysis and machine learning. She develops innovative algorithms for processing and analyzing complex scientific datasets.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', 'maria.rodriguez@example.com', 'https://example.com/maria-rodriguez', 'mariarodriguez', 'maria-rodriguez', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES
(1, 'Physics', current_timestamp()),
(2, 'Biology', current_timestamp()),
(3, 'Chemistry', current_timestamp()),
(4, 'Astronomy', current_timestamp()),
(5, 'Technology', current_timestamp()),
(6, 'Environment', current_timestamp()),
(7, 'Medicine', current_timestamp()),
(8, 'Research', current_timestamp()),
(9, 'Education', current_timestamp()),
(10, 'Climate', current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `published_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_time` varchar(50) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `excerpt`, `content`, `author_id`, `published_at`, `read_time`, `cover_image`, `created_at`, `updated_at`) VALUES
(1, 'The Future of Quantum Computing', 'Exploring the potential applications and challenges of quantum computing technologies in the next decade.', 'Quantum computing represents one of the most exciting frontiers in technology today. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits that can exist in multiple states simultaneously, thanks to the principles of superposition and entanglement.\n\nThis unique property allows quantum computers to perform certain calculations exponentially faster than their classical counterparts. As we look towards the future, the potential applications of quantum computing are vast and transformative.\n\nIn fields like cryptography, quantum computers pose both threats and opportunities. They could potentially break many of the encryption algorithms that currently secure our digital communications. However, they also enable quantum encryption methods that are theoretically unbreakable.\n\nIn the realm of scientific research, quantum simulations could revolutionize our understanding of molecular and chemical processes, accelerating drug discovery and material science innovation. Complex optimization problems in logistics, finance, and artificial intelligence could be solved with unprecedented efficiency.\n\nDespite these promising applications, significant challenges remain. Quantum coherence – maintaining the quantum state of qubits – is extremely difficult, as these systems are highly sensitive to environmental disturbances. Error correction, scalability, and creating practical quantum algorithms are ongoing areas of intensive research.\n\nAs we move forward, a hybrid approach combining classical and quantum computing may bridge the gap between current capabilities and the full realization of quantum potential. The next decade will likely see quantum computers moving from research labs to practical applications, though widespread commercial availability may take longer.\n\nThe quantum computing race is truly global, with major investments from governments and technology companies worldwide. The field requires interdisciplinary collaboration between physicists, computer scientists, engineers, and mathematicians.\n\nWhile we should be cautious about overhyping near-term capabilities, the long-term impact of quantum computing could be as revolutionary as the classical computer itself, opening new frontiers in human knowledge and technological capability.', 1, '2023-06-15 08:00:00', '8 min read', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', current_timestamp(), current_timestamp()),
(2, 'Understanding CRISPR Gene Editing', 'A comprehensive guide to how CRISPR technology works and its implications for medicine and ethics.', 'CRISPR-Cas9 has emerged as one of the most powerful and versatile tools in molecular biology, revolutionizing our ability to edit genetic code with precision. Originally discovered as part of the immune system in bacteria, scientists have adapted this system into a sophisticated gene editing technology.\n\nAt its core, CRISPR-Cas9 works like a genetic scissor. The Cas9 enzyme cuts DNA at specific locations determined by a guide RNA molecule. Once the DNA is cut, the cell\'s natural repair mechanisms take over, either connecting the cut ends (which can disable a gene) or using a provided DNA template to repair the cut (allowing for precise editing or insertion of new genetic information).\n\nThe medical implications of CRISPR are profound. For genetic diseases caused by single mutations – like cystic fibrosis, sickle cell anemia, or Huntington\'s disease – CRISPR offers the theoretical possibility of a cure by correcting the underlying genetic defect. Clinical trials are already underway for several conditions, with promising early results for blood disorders like sickle cell disease.\n\nBeyond treating disease, CRISPR could enhance our understanding of human biology by allowing scientists to study the function of specific genes through precise manipulation. In agriculture, it holds promise for developing crops with improved nutritional value, drought resistance, and disease resistance.\n\nHowever, these powerful capabilities raise significant ethical questions. The potential for heritable genetic modifications in humans – particularly for non-medical "enhancement" purposes – has sparked global debate. Issues of consent, access, and the boundary between treatment and enhancement remain contentious.\n\nThere are also technical challenges to address. Off-target effects (unintended edits in similar DNA sequences), delivery methods for getting CRISPR components into the right cells, and ensuring edits occur in all target cells are active areas of research.\n\nAs CRISPR technology continues to advance, society must thoughtfully navigate both its tremendous potential benefits and the profound ethical considerations it raises. International collaboration on regulatory frameworks will be essential to ensure this technology develops in a way that maximizes human benefit while minimizing risks and respecting diverse ethical perspectives.', 2, '2023-05-22 10:30:00', '12 min read', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', current_timestamp(), current_timestamp()),
(3, 'Climate Change: The Latest Research', 'An overview of the most recent scientific findings on global climate change and its effects.', 'Recent climate research continues to build upon decades of scientific evidence, providing an increasingly detailed picture of our changing planet. The latest IPCC report represents the most comprehensive assessment to date, drawing on thousands of studies from scientists worldwide.\n\nGlobal temperature data show unequivocal warming, with each of the last four decades successively warmer than any previous decade since pre-industrial times. The Earth\'s average temperature has increased by approximately 1.1°C since the pre-industrial era, with the rate of warming accelerating in recent decades.\n\nAtmospheric carbon dioxide concentrations have reached levels unprecedented in at least 2 million years, primarily due to fossil fuel combustion and land-use changes. Other greenhouse gases like methane and nitrous oxide show similar concerning trends.\n\nOceanic impacts are equally striking. Beyond absorbing over 90% of excess heat in the climate system, oceans have experienced significant acidification due to absorbed CO2. Marine heatwaves have doubled in frequency since the 1980s, devastating coral reefs and marine ecosystems worldwide.\n\nThe cryosphere continues to respond dramatically to warming. Arctic sea ice is declining at rates of 12.8% per decade, while Antarctic ice sheet loss has tripled since 2007. Mountain glaciers worldwide are retreating, affecting water resources for millions of people.\n\nExtreme weather events increasingly bear the fingerprint of climate change. Attribution science now enables researchers to quantify how climate change has increased the likelihood and intensity of specific events, from heatwaves and heavy precipitation to droughts and tropical cyclones.\n\nTipping points in the climate system – thresholds that, when crossed, lead to large and often irreversible changes – have moved from theoretical concerns to areas of active observation. Systems like the Amazon rainforest, West Antarctic ice sheet, and Atlantic Meridional Overturning Circulation show worrying signs of approaching instability.\n\nProjections for future warming depend heavily on emissions pathways. Limiting warming to 1.5°C above pre-industrial levels requires immediate, rapid and large-scale reductions in greenhouse gas emissions, reaching net zero CO2 emissions by around 2050.\n\nWhile the scientific evidence presents a clear challenge, it also outlines the path forward. Renewable energy technologies have advanced rapidly, efficiency improvements offer immediate benefits, and natural climate solutions can complement technological approaches. The climate challenge is immense but not insurmountable if decisive action is taken without delay.', 3, '2023-04-10 15:45:00', '10 min read', 'https://images.unsplash.com/photo-1584215189160-c9a8b8a90b6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_tags`
--

DROP TABLE IF EXISTS `blog_post_tags`;
CREATE TABLE `blog_post_tags` (
  `blog_post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`blog_post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_post_tags`
--

INSERT INTO `blog_post_tags` (`blog_post_id`, `tag_id`) VALUES
(1, 1),
(1, 5),
(2, 2),
(2, 7),
(3, 6),
(3, 8),
(3, 10);

-- --------------------------------------------------------

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
CREATE TABLE `blog_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blog_post_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `parent_comment_id` int(11) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `blog_post_id` (`blog_post_id`),
  KEY `author_id` (`author_id`),
  KEY `parent_comment_id` (`parent_comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_comments`
--

INSERT INTO `blog_comments` (`id`, `blog_post_id`, `author_id`, `content`, `parent_comment_id`, `likes`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Fascinating article! I wonder how quantum computing will affect cybersecurity in the next five years.', NULL, 2, '2023-06-16 14:30:00', '2023-06-16 14:30:00'),
(2, 1, 4, 'Great overview of the challenges. I think error correction is the biggest hurdle to overcome before we see practical quantum advantage.', NULL, 1, '2023-06-17 09:45:00', '2023-06-17 09:45:00'),
(3, 2, 1, 'The ethical considerations of CRISPR are fascinating. I think international regulatory frameworks are essential.', NULL, 3, '2023-05-23 08:15:00', '2023-05-23 08:15:00'),
(4, 2, 2, 'I\'m most excited about the potential applications in treating genetic diseases. The early results for sickle cell disease are promising!', NULL, 2, '2023-05-24 11:20:00', '2023-05-24 11:20:00'),
(5, 3, 4, 'Very informative article. The tipping points concern me the most - are there any signs that we\'re making progress fast enough to avoid them?', NULL, 4, '2023-04-11 16:20:00', '2023-04-11 16:20:00'),
(6, 3, 2, 'I appreciate the clear presentation of the latest data. Do you have any recommendations for reliable sources where the general public can stay informed about climate science?', NULL, 1, '2023-04-12 09:30:00', '2023-04-12 09:30:00'),
(7, 3, 3, 'The section on Arctic amplification was particularly eye-opening. I hadn\'t realized the jet stream connection to extreme weather events.', NULL, 0, '2023-04-13 14:45:00', '2023-04-13 14:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

DROP TABLE IF EXISTS `forum_posts`;
CREATE TABLE `forum_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_posts`
--

INSERT INTO `forum_posts` (`id`, `title`, `content`, `author_id`, `created_at`, `updated_at`) VALUES
(1, 'Interesting new black hole research', 'I just read a fascinating paper about black hole event horizons. Has anyone else seen this research? I\'d love to discuss the implications.', 1, current_timestamp(), current_timestamp()),
(2, 'Tips for science fair projects', 'My daughter is entering her first science fair. Any suggestions for creative projects that would be engaging for a 12-year-old interested in biology?', 2, current_timestamp(), current_timestamp()),
(3, 'Science communication challenges', 'As scientists, how can we better communicate complex topics to the general public? I\'m finding it increasingly important but challenging.', 3, current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `forum_replies`
--

DROP TABLE IF EXISTS `forum_replies`;
CREATE TABLE `forum_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `forum_post_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `forum_post_id` (`forum_post_id`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_replies`
--

INSERT INTO `forum_replies` (`id`, `forum_post_id`, `author_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Yes, I read that paper too! The way they measured the radiation signatures was particularly innovative.', current_timestamp(), current_timestamp()),
(2, 1, 4, 'The implications for our understanding of information paradox are huge. I\'m curious about their methodology though.', current_timestamp(), current_timestamp()),
(3, 2, 1, 'Growing crystals is always a hit with kids that age. You could also try simple DNA extraction from fruits - it\'s visual and connects to biology.', current_timestamp(), current_timestamp()),
(4, 2, 3, 'How about a project on plant growth with different types of light? It\'s relatively simple to set up but can teach a lot about photosynthesis.', current_timestamp(), current_timestamp()),
(5, 3, 2, 'I\'ve found that using analogies from everyday life helps immensely when explaining complex concepts. Also, focusing on "why it matters" before diving into details.', current_timestamp(), current_timestamp()),
(6, 3, 4, 'Visual aids and interactive demonstrations make a huge difference. Also, practice explaining to non-experts and get feedback on what parts were confusing.', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 50,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `time`, `location`, `capacity`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Annual Science Symposium 2023', 'Join us for our annual science symposium featuring keynote speakers from various scientific disciplines and interactive workshops.', '2023-09-15', '09:00 AM - 05:00 PM', 'Main Campus Auditorium', 200, 1, current_timestamp(), current_timestamp()),
(2, 'Quantum Computing Workshop', 'Hands-on workshop introducing the basics of quantum computing and its applications in scientific research.', '2023-08-22', '10:00 AM - 02:00 PM', 'Computer Science Building, Room 301', 50, 2, current_timestamp(), current_timestamp()),
(3, 'Environmental Science Field Trip', 'A day-long excursion to study local ecosystems and collect data for environmental research projects.', '2023-10-05', '08:00 AM - 04:00 PM', 'Riverside Nature Reserve', 30, 3, current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_user_unique` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `event_id`, `user_id`, `registered_at`) VALUES
(1, 1, 2, current_timestamp()),
(2, 1, 3, current_timestamp()),
(3, 1, 4, current_timestamp()),
(4, 2, 1, current_timestamp()),
(5, 2, 3, current_timestamp()),
(6, 3, 2, current_timestamp()),
(7, 3, 4, current_timestamp());

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

DROP TABLE IF EXISTS `contact_submissions`;
CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `name`, `email`, `subject`, `message`, `created_at`, `is_read`) VALUES
(1, 'John Doe', 'john@example.com', 'Collaboration Opportunity', 'I represent a local school and would love to discuss potential educational partnerships with Science Hub.', current_timestamp(), 0),
(2, 'Jane Smith', 'jane@example.com', 'Speaker Request', 'I\'m organizing a conference on climate science and would like to invite someone from your team as a keynote speaker.', current_timestamp(), 0);

-- --------------------------------------------------------

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD CONSTRAINT `blog_comments_ibfk_1` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_comments_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `blog_comments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_post_tags`
--
ALTER TABLE `blog_post_tags`
  ADD CONSTRAINT `blog_post_tags_ibfk_1` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`forum_post_id`) REFERENCES `forum_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- Club Registration table
CREATE TABLE `club_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form_no` varchar(20) DEFAULT NULL,
  `registration_no` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `place_of_birth` varchar(100) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `guardian_name` varchar(100) DEFAULT NULL,
  `guardian_mobile` varchar(20) DEFAULT NULL,
  `school_name` varchar(100) DEFAULT NULL,
  `class1` varchar(20) DEFAULT NULL,
  `gpa1` varchar(10) DEFAULT NULL,
  `class2` varchar(20) DEFAULT NULL,
  `gpa2` varchar(10) DEFAULT NULL,
  `hobby` text DEFAULT NULL,
  `correspondence` text DEFAULT NULL,
  `past_participant` varchar(5) DEFAULT NULL,
  `why_join` text DEFAULT NULL,
  `clubs` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
