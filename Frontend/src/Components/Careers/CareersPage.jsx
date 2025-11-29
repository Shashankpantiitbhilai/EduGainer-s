import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Paper,
  useTheme,
  alpha,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Code as CodeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Rocket as RocketIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { designTokens } from '../../theme/enterpriseTheme';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';

const CareersPage = () => {
  const theme = useTheme();
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Hardcoded job postings
  const jobPostings = [
    {
      id: 1,
      title: "Full Stack Developer Intern",
      department: "Engineering",
      location: "Hybrid/Remote",
      type: "Internship",
      duration: "3-6 months",
      stipend: "Competitive, based on experience and performance",
      description: "EduGainer's focuses on building comprehensive educational solutions including digital libraries, interactive classes, AI-powered chatbots, and educational resources. As a Full Stack Developer Intern, you'll work on our MERN stack platform that serves students with study spaces, course management, and intelligent tutoring systems.",
      requirements: [
        "Currently pursuing Bachelor's degree ",
        "Strong knowledge of JavaScript, React.js, and Node.js",
        "Experience with MongoDB and Express.js (MERN stack)",
        "Understanding of RESTful APIs and database design",
        "Knowledge of Git and version control",
        "Good problem-solving and communication skills",
        "Passion for education technology"
      ],
      responsibilities: [
        "Develop and maintain feature on existing application using MERN stack",
        "Collaborate with senior developers on feature implementation",
        "Write clean, maintainable, and efficient code",
        "Participate in code reviews and team discussions",
        "Help improve platform performance and user experience",
        "Assist in testing and debugging applications",
        "Contribute to technical documentation"
      ],
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "HTML5", "CSS3", "Git"],
      benefits: [
        "Hands-on experience with production-level applications",
        "Mentorship from experienced developers",
        "Flexible working hours",
        "Performance-based stipend increments",
        "Letter of recommendation upon successful completion",
        "Opportunity for full-time conversion",
        "Access to learning resources and training"
      ],
      posted: "2 days ago",
      applications: 45,
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Hybrid/Remote",
      type: "Internship",
      duration: "2-4 months",
      stipend: "Competitive, based on experience and performance",
      description: "EduGainer's creates user-friendly interfaces for our educational platform including library booking systems, class enrollment portals, AI chat interfaces, and resource management dashboards. You'll work with React.js and Material-UI to build responsive components that make learning accessible and intuitive.",
      requirements: [
        "Strong proficiency in React.js and JavaScript",
        "Experience with Material-UI or similar component libraries",
        "Knowledge of responsive web design",
        "Understanding of modern CSS and styling frameworks",
        "Familiarity with state management (Redux/Context API)",
        "Basic understanding of RESTful APIs",
        "Portfolio showcasing web development projects"
      ],
      responsibilities: [
        "Develop responsive and interactive user interfaces",
        "Implement designs and wireframes into high-quality code",
        "Optimize applications for speed and scalability",
        "Collaborate with UX/UI designers",
        "Ensure cross-browser compatibility",
        "Participate in design and code reviews",
        "Contribute to component library development"
      ],
      techStack: ["React.js", "Material-UI", "JavaScript", "CSS3", "HTML5", "Redux", "Figma"],
      benefits: [
        "Work on user-facing features",
        "Learn modern frontend technologies",
        "Collaborate with design team",
        "Flexible remote work",
        "Skill development opportunities",
        "Project-based learning approach"
      ],
      posted: "1 week ago",
      applications: 32,
    },
    {
      id: 3,
      title: "Backend Developer Intern",
      department: "Engineering",
      location: "Hybrid/Remote",
      type: "Internship",
      duration: "3-6 months",
      stipend: "Competitive, based on experience and performance",
      description: "EduGainer's backend powers our core services: library seat management, class scheduling systems, AI chatbot APIs, user authentication, payment processing, and real-time notifications. You'll work with Node.js, Express.js, and MongoDB to build scalable APIs that handle thousands of student interactions daily.",
      requirements: [
        "Strong knowledge of Node.js and Express.js",
        "Experience with MongoDB and database design",
        "Understanding of RESTful API development",
        "Knowledge of authentication and authorization",
        "Familiarity with cloud services (AWS/GCP preferred)",
        "Understanding of microservices architecture",
        "Experience with testing frameworks"
      ],
      responsibilities: [
        "Design and develop RESTful APIs",
        "Implement database schemas and queries",
        "Optimize application performance and scalability",
        "Implement security best practices",
        "Work with third-party integrations",
        "Monitor and debug production issues",
        "Contribute to system architecture decisions"
      ],
      techStack: ["Node.js", "Express.js", "MongoDB", "AWS", "Redis", "JWT", "Docker"],
      benefits: [
        "Learn scalable backend architecture",
        "Work with cloud technologies",
        "Performance optimization experience",
        "Database design skills",
        "Production environment exposure",
        "Security implementation knowledge"
      ],
      posted: "3 days ago",
      applications: 28,
    },
    {
      id: 4,
      title: "GS Uttarakhand Faculty",
      department: "Academics",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time/Part-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience and qualifications",
      description: "EduGainer's is seeking an experienced and passionate General Studies (GS) faculty member specializing in Uttarakhand-specific content. The ideal candidate will teach students preparing for various competitive exams including UKPSC, UKSSSC, and other state-level examinations. You'll be responsible for delivering comprehensive GS classes covering history, geography, polity, economics, and current affairs related to Uttarakhand.",
      requirements: [
        "Master's degree in relevant field (History, Geography, Political Science, or related)",
        "Minimum 2-3 years of teaching experience in competitive exam preparation",
        "Strong knowledge of Uttarakhand state-specific content",
        "Excellent communication and presentation skills",
        "Ability to create engaging study materials and notes",
        "Experience with online and offline teaching methods",
        "Passion for teaching and student success"
      ],
      responsibilities: [
        "Deliver comprehensive GS classes for Uttarakhand competitive exams",
        "Prepare study materials, notes, and practice questions",
        "Conduct regular assessments and provide feedback",
        "Mentor students and provide guidance for exam preparation",
        "Stay updated with latest exam patterns and syllabus changes",
        "Collaborate with other faculty members for curriculum development",
        "Maintain student records and track progress"
      ],
      techStack: ["Teaching", "Content Creation", "Assessment Tools", "Online Platforms"],
      benefits: [
        "Competitive salary package",
        "Performance-based incentives",
        "Professional development opportunities",
        "Flexible working hours",
        "Supportive work environment",
        "Opportunity to make a real impact on students' careers"
      ],
      posted: "1 week ago",
      applications: 15,
    },
    {
      id: 5,
      title: "Speaking English Faculty",
      department: "Academics",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time/Part-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience and qualifications",
      description: "EduGainer's is looking for a dynamic Speaking English faculty member to help students improve their English communication skills. The role involves teaching spoken English, pronunciation, grammar, and conversation skills to students preparing for various competitive exams and personal development. You'll conduct interactive sessions, group discussions, and one-on-one coaching to enhance students' confidence in English speaking.",
      requirements: [
        "Bachelor's/Master's degree in English, Linguistics, or related field",
        "Excellent command over spoken and written English",
        "Minimum 2 years of teaching experience in English communication",
        "Strong interpersonal and communication skills",
        "Ability to create engaging and interactive learning experiences",
        "Experience with modern teaching methodologies",
        "Certification in English language teaching (preferred)"
      ],
      responsibilities: [
        "Conduct speaking English classes for students",
        "Design and implement interactive learning activities",
        "Provide personalized feedback on pronunciation and fluency",
        "Organize group discussions and conversation practice sessions",
        "Create study materials and practice exercises",
        "Assess student progress and provide improvement strategies",
        "Maintain a positive and encouraging learning environment"
      ],
      techStack: ["Teaching", "Language Learning Tools", "Assessment Methods"],
      benefits: [
        "Competitive salary package",
        "Performance bonuses",
        "Professional growth opportunities",
        "Flexible schedule",
        "Creative teaching environment",
        "Impact on students' career growth"
      ],
      posted: "5 days ago",
      applications: 22,
    },
    {
      id: 6,
      title: "SSC Faculty",
      department: "Academics",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time/Part-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience and qualifications",
      description: "EduGainer's seeks an experienced SSC (Staff Selection Commission) faculty member to teach students preparing for various SSC examinations including SSC CGL, CHSL, MTS, and other SSC exams. The ideal candidate will have comprehensive knowledge of SSC exam patterns, syllabus, and effective teaching strategies to help students achieve success in these competitive exams.",
      requirements: [
        "Graduate/Post-graduate degree in relevant field",
        "Minimum 3 years of experience teaching SSC exam preparation",
        "In-depth knowledge of SSC exam patterns and syllabus",
        "Strong analytical and problem-solving skills",
        "Excellent teaching and communication abilities",
        "Ability to simplify complex concepts",
        "Experience with both quantitative aptitude and general awareness"
      ],
      responsibilities: [
        "Teach SSC exam subjects including Quantitative Aptitude, English, General Awareness, and Reasoning",
        "Develop comprehensive study plans and strategies",
        "Create practice tests and mock exams",
        "Provide detailed explanations and shortcuts for problem-solving",
        "Track student progress and provide personalized guidance",
        "Stay updated with latest SSC exam notifications and changes",
        "Conduct doubt-clearing sessions and provide mentorship"
      ],
      techStack: ["Teaching", "Assessment Tools", "Online Learning Platforms"],
      benefits: [
        "Attractive salary package",
        "Performance-based incentives",
        "Professional development support",
        "Flexible working arrangements",
        "Opportunity to help students achieve their dreams",
        "Supportive team environment"
      ],
      posted: "1 week ago",
      applications: 18,
    },
    {
      id: 7,
      title: "Tuition Faculty (9th to 12th)",
      department: "Academics",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time/Part-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience and qualifications",
      description: "EduGainer's is looking for dedicated tuition faculty members to teach students from 9th to 12th grade across various subjects including Mathematics, Science, English, and Social Studies. The role involves providing personalized attention to students, helping them understand concepts clearly, and preparing them for board examinations and competitive exams. You'll work with small groups or individual students to ensure their academic success.",
      requirements: [
        "Bachelor's/Master's degree in relevant subject",
        "Minimum 2 years of experience in teaching 9th-12th grade students",
        "Strong subject knowledge and teaching skills",
        "Patience and ability to work with students of different learning levels",
        "Good communication and interpersonal skills",
        "Ability to create engaging lesson plans",
        "Experience with CBSE/State board curriculum"
      ],
      responsibilities: [
        "Teach students from 9th to 12th grade in assigned subjects",
        "Prepare lesson plans and study materials",
        "Conduct regular assessments and provide feedback",
        "Help students with homework and doubt clearing",
        "Prepare students for board examinations",
        "Maintain regular communication with parents about student progress",
        "Create a positive and motivating learning environment"
      ],
      techStack: ["Teaching", "Educational Tools", "Assessment Methods"],
      benefits: [
        "Competitive remuneration",
        "Flexible working hours",
        "Performance incentives",
        "Professional growth opportunities",
        "Rewarding work with young minds",
        "Supportive management"
      ],
      posted: "3 days ago",
      applications: 25,
    },
    {
      id: 8,
      title: "Accountant",
      department: "Administration",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience and qualifications",
      description: "EduGainer's is seeking a qualified and experienced Accountant to manage our financial operations. The ideal candidate will be responsible for maintaining accurate financial records, handling day-to-day accounting tasks, managing invoices, payments, and ensuring compliance with financial regulations. You'll work closely with the management team to provide financial insights and support decision-making.",
      requirements: [
        "Bachelor's degree in Commerce, Accounting, or Finance",
        "Minimum 2-3 years of accounting experience",
        "Proficiency in accounting software (Tally, QuickBooks, or similar)",
        "Strong knowledge of accounting principles and practices",
        "Good understanding of tax regulations and compliance",
        "Excellent attention to detail and accuracy",
        "Strong analytical and problem-solving skills",
        "Proficiency in MS Excel and other office software"
      ],
      responsibilities: [
        "Maintain accurate financial records and books of accounts",
        "Handle accounts payable and receivable",
        "Prepare and process invoices, payments, and receipts",
        "Reconcile bank statements and accounts",
        "Prepare monthly, quarterly, and annual financial reports",
        "Assist in budget preparation and financial planning",
        "Ensure compliance with tax regulations and filing requirements",
        "Maintain inventory and asset records",
        "Coordinate with auditors and tax consultants"
      ],
      techStack: ["Tally", "QuickBooks", "MS Excel", "Accounting Software"],
      benefits: [
        "Competitive salary package",
        "Performance-based bonuses",
        "Professional development opportunities",
        "Stable work environment",
        "Health benefits",
        "Opportunity for career growth"
      ],
      posted: "1 week ago",
      applications: 12,
    },
    {
      id: 9,
      title: "Office Staff",
      department: "Administration",
      location: "Uttarkashi, Uttarakhand",
      type: "Full-time",
      duration: "Permanent",
      stipend: "Competitive salary based on experience",
      description: "EduGainer's is looking for efficient and organized Office Staff to support our daily administrative operations. The ideal candidate will handle front desk duties, manage student inquiries, assist with administrative tasks, maintain records, and ensure smooth day-to-day operations of the office. You'll be the first point of contact for students and visitors, so excellent communication skills and a friendly demeanor are essential.",
      requirements: [
        "High school diploma or equivalent (Graduate preferred)",
        "Minimum 1-2 years of experience in office administration or customer service",
        "Proficiency in MS Office (Word, Excel, PowerPoint)",
        "Excellent communication skills in Hindi and English",
        "Strong organizational and multitasking abilities",
        "Friendly and professional demeanor",
        "Ability to work in a fast-paced environment",
        "Basic knowledge of office equipment (printer, scanner, etc.)"
      ],
      responsibilities: [
        "Handle front desk operations and greet visitors",
        "Manage student inquiries and provide information",
        "Maintain student records and files",
        "Assist with fee collection and record keeping",
        "Coordinate with faculty and management",
        "Handle phone calls and emails",
        "Maintain office supplies and inventory",
        "Assist with event organization and coordination",
        "Perform general administrative tasks as assigned"
      ],
      techStack: ["MS Office", "Basic Computer Skills", "Office Management"],
      benefits: [
        "Competitive salary",
        "Performance incentives",
        "Stable employment",
        "Friendly work environment",
        "Opportunity to learn and grow",
        "Health benefits"
      ],
      posted: "4 days ago",
      applications: 20,
    }
  ];

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  const companyHighlights = [
    {
      icon: <SchoolIcon />,
      title: "EdTech Innovation",
      description: "Building the future of education with cutting-edge technology"
    },
    {
      icon: <PeopleIcon />,
      title: "Collaborative Team",
      description: "Work with passionate developers and education experts"
    },
    {
      icon: <RocketIcon />,
      title: "Growth Opportunities",
      description: "Fast-track your career with hands-on experience"
    },
    {
      icon: <CodeIcon />,
      title: "Modern Tech Stack",
      description: "Work with latest technologies and best practices"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: designTokens.typography.fontWeight.bold,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Join EduGainer's Team
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  fontWeight: designTokens.typography.fontWeight.medium,
                }}
              >
                Shape the Future of Education Technology
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.1rem',
                  opacity: 0.8,
                  maxWidth: 600,
                }}
              >
                We're looking for passionate developers and innovators to join our mission of making quality education accessible to everyone. Start your career with hands-on experience in a fast-growing EdTech company.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                    transform: 'translateY(-2px)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                View Open Positions
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '4rem',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: '4rem' }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Company Highlights */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: designTokens.typography.fontWeight.bold,
            color: theme.palette.text.primary,
          }}
        >
          Why Choose EduGainer's?
        </Typography>
        <Grid container spacing={4}>
          {companyHighlights.map((highlight, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: designTokens.borderRadius.lg,
                  transition: `all ${designTokens.animation.duration.normal}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {highlight.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: designTokens.typography.fontWeight.semibold,
                  }}
                >
                  {highlight.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  {highlight.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Job Listings */}
      <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.02), py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: designTokens.typography.fontWeight.bold,
                color: theme.palette.text.primary,
              }}
            >
              Open Positions
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join our team and help build innovative solutions that transform education. We're currently hiring for the following internship positions.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {jobPostings.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <JobCard job={job} onJobClick={handleJobClick} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: designTokens.borderRadius.xl,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.text.primary,
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontSize: '1.1rem',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Don't see the perfect role? We're always looking for talented individuals who are passionate about education and technology. Send us your resume and let us know how you'd like to contribute!
          </Typography>
          <Button
            variant="contained"
            size="large"
            component="a"
            href="https://wa.me/918126857111?text=Hi%20EduGainer's%20Team,%20I'm%20interested%20in%20the%20internship%20opportunities%20at%20your%20company.%20Could%20you%20please%20share%20more%20details?"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: '#25D366',
              color: 'white',
              fontWeight: designTokens.typography.fontWeight.semibold,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#20B954',
                transform: 'translateY(-2px)',
              },
            }}
          >
            WhatsApp Us
          </Button>
        </Paper>
      </Container>

      {/* Job Details Modal */}
      <JobDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </Box>
  );
};

export default CareersPage;
