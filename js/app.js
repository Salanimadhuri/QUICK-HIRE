// --- 1. IMPORTS ---
import * as state from './state.js';
import { storage, initializeJobsPageState } from './storage.js';
import * as views from './views.js';
import { createEl } from './utils.js';

// --- 2. EVENT HANDLERS / NAVIGATION ---
// These functions live here because they need to call renderApp()

function onNavigate(page) {
    if (state.currentPage !== page) {
        state.updateCurrentPage(page);
        state.updateShowNotifications(false);
        renderApp();
    }
}

function toggleNotifications() {
    state.toggleShowNotifications();
    renderApp();
}

function handleFilterChange(key, value) {
    state.jobsPageState[key] = value;
    renderApp();
}

function handleClearFilters() {
    state.jobsPageState.searchTerm = '';
    state.jobsPageState.locationFilter = '';
    state.jobsPageState.typeFilter = '';
    state.jobsPageState.categoryFilter = '';
    renderApp();
}

function handleApply(job) {
    const currentUser = state.authState.currentUser;
    if (!currentUser || currentUser.type !== 'seeker') {
        onNavigate('login');
        return;
    }

    const application = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        applicantName: currentUser.name,
        applicantEmail: currentUser.email,
    };

    storage.addApplication(application);

    // Notification for the Seeker (Confirmation)
    storage.addNotification({
        id: `notif-seeker-${Date.now()}`,
        message: `Successfully applied to ${job.title} at ${job.company}.`,
        type: 'success',
        timestamp: new Date().toISOString(),
        recipientEmail: currentUser.email
    });
    
    // Notification for the Recruiter
    const allUsers = storage.getUsers();
    const recruiter = allUsers.find(user => user.id === job.recruiterId);
    if (recruiter) {
        storage.addNotification({
            id: `notif-recruiter-${Date.now()}`,
            message: `New application from ${currentUser.name} for '${job.title}'.`,
            type: 'info',
            timestamp: new Date().toISOString(),
            recipientEmail: recruiter.email
        });
    }
    
    initializeJobsPageState(state.jobsPageState, state.authState);
    renderApp();
}

function togglePostJobForm() {
    state.recruiterPageState.showForm = !state.recruiterPageState.showForm;
    renderApp();
}

function handleRecruiterFormChange(key, value) {
    state.recruiterPageState.formData[key] = value;
}

function handleRecruiterFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    const newJob = {
        id: `job-${Date.now()}`,
        title: form.title.value,
        company: form.company.value,
        location: form.location.value,
        type: form.type.value,
        category: form.category.value,
        skills: form.skills.value.split(',').map(s => s.trim()),
        salary: form.salary.value,
        description: form.description.value,
        postedDate: new Date().toISOString().split('T')[0],
        recruiterId: state.authState.currentUser.id,
    };

    const postedJobs = storage.getRecruiterJobs();
    storage.setRecruiterJobs([...postedJobs, newJob]);
    
    state.recruiterPageState.formData = {
        title: '', company: '', location: '', type: 'Full-Time', category: '', skills: '', salary: '', description: '',
    };
    state.recruiterPageState.showForm = false;
    
    renderApp();
}

function handleDeleteJob(jobId, jobTitle) {
    const confirmed = window.confirm(`Are you sure you want to delete the job posting for "${jobTitle}"? This will also remove all applications for this job.`);
    if (confirmed) {
        storage.deleteJob(jobId);
        renderApp();
    }
}

function handleLogout() {
    storage.clearCurrentUser();
    state.updateAuthState({
        ...state.authState,
        isLoggedIn: false,
        currentUser: null,
    });
    onNavigate('login');
}

function handleLogin(e) {
    e.preventDefault();
    const { email, password, type } = state.authState.loginFormData;
    const users = storage.getUsers();
    
    const user = users.find(u => u.email === email && u.password === password && u.type === type);
    
    if (user) {
        storage.setCurrentUser(user);
        state.updateAuthState({
            ...state.authState,
            isLoggedIn: true,
            currentUser: user,
        });
        onNavigate(user.type === 'seeker' ? 'candidate' : 'recruiter');
    } else {
        alert("Login Failed. Check email, password, and user type.");
    }
}

function handleRegistration(e) {
    e.preventDefault();
    const { name, email, password, skills, location, companyName } = state.authState.registerFormData;
    const type = state.authState.registerUserType;

    const users = storage.getUsers();
    if (users.some(u => u.email === email)) {
        alert("Registration failed: Email already in use.");
        return;
    }

    const newUser = {
        id: `user-${Date.now()}`,
        type, name, email, password,
        skills: type === 'seeker' ? skills.split(',').map(s => s.trim()) : undefined,
        location: type === 'seeker' ? location : undefined,
        companyName: type === 'recruiter' ? companyName : undefined,
    };

    storage.setUsers([...users, newUser]);
    storage.setCurrentUser(newUser);
    state.updateAuthState({
        ...state.authState,
        isLoggedIn: true,
        currentUser: newUser,
    });
    onNavigate(type === 'seeker' ? 'candidate' : 'recruiter');
}

function setAuthMode(mode) {
    state.authState.authMode = mode;
    renderApp();
}

function handleForgotPassword() {
    const email = state.authState.loginFormData.email;
    if (!email) {
        alert("Please enter your email first to reset the password.");
        return;
    }
    const users = storage.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        alert("No account found with this email.");
        return;
    }
    alert(`Password reset link has been sent to ${email}.`);
}

function setRegisterUserType(type) {
    state.authState.registerUserType = type;
    state.authState.registerFormData = { 
        name: '', email: '', password: '', 
        skills: '', location: '', companyName: '' 
    };
    renderApp();
}

function setReviewingApplication(appId) {
    state.recruiterPageState.reviewingApplicationId = appId;
    state.recruiterPageState.interviewDateDraft = ''; 
    state.recruiterPageState.interviewDateDraftValue = '';
    renderApp();
}

function handleInterviewDateChange(e) {
    state.recruiterPageState.interviewDateDraftValue = e.target.value;
    renderApp();
}

function updateApplicationStatus(appId, status, isShortlisting = false, interviewDate = null) {
    const application = storage.getApplications().find(app => app.id === appId);
    
    const finalInterviewDate = isShortlisting ? interviewDate : null;
    
    if (isShortlisting && !finalInterviewDate) {
        alert("Please select a valid interview date to shortlist the candidate.");
        return;
    }
    
    if (application) {
        storage.addNotification({
            id: `notif-${Date.now()}`,
            message: `Update: Your application for '${application.jobTitle}' was set to ${status}.`,
            type: 'info',
            timestamp: new Date().toISOString(),
            recipientEmail: application.applicantEmail
        });
    }

    storage.updateApplicationStatus(appId, status, finalInterviewDate);
    state.recruiterPageState.reviewingApplicationId = null;
    state.recruiterPageState.interviewDateDraft = '';
    state.recruiterPageState.interviewDateDraftValue = '';
    renderApp();
}

// Add this new function
function setShortlistMode(appId) {
    state.recruiterPageState.interviewDateDraft = 'draft';
    state.recruiterPageState.interviewDateDraftValue = '';
    state.recruiterPageState.reviewingApplicationId = appId; // Ensure the ID is still set
    renderApp();
}


// --- 3. MAIN RENDER FUNCTION (THE "ROUTER") ---

function renderApp() {
    const root = document.getElementById('app-root');
    root.innerHTML = ''; // Clear previous content

    // Create a bundle of all handlers to pass to the views
    const handlers = {
        onNavigate,
        toggleNotifications,
        handleFilterChange,
        handleClearFilters,
        handleApply,
        togglePostJobForm,
        handleRecruiterFormChange, // Note: This is passed to the form, not called directly
        handleRecruiterFormSubmit,
        handleDeleteJob,
        handleLogout,
        handleLogin,
        handleRegistration,
        setAuthMode,
        handleForgotPassword,
        setRegisterUserType,
        setReviewingApplication,
        handleInterviewDateChange,
        updateApplicationStatus,
        setShortlistMode
    };

    // Correctly define which pages are public
    const publicPages = ['home', 'about', 'login', 'register'];
    
    // If user is not logged in AND trying to access a non-public page, redirect to login
    if (!state.authState.isLoggedIn && !publicPages.includes(state.currentPage)) {
        state.updateCurrentPage('login');
    }
    
    // 1. Render Header (shows login/logout)
    root.appendChild(views.renderHeader(handlers));

    // 2. Render Page Content based on current route
    let content;
    switch (state.currentPage) {
        case 'home':
            content = views.renderHomePageContent(handlers);
            break;
        case 'login':
        case 'register':
            content = views.renderAuthPageContent(handlers);
            break;
        case 'candidate':
            if (!state.authState.isLoggedIn || state.authState.currentUser.type !== 'seeker') { onNavigate('login'); return; }
            content = views.renderCandidateDashboardContent(handlers);
            break;
        case 'jobs':
            content = views.renderJobsPageContent(handlers);
            break;
        case 'recruiter':
            if (!state.authState.isLoggedIn || state.authState.currentUser.type !== 'recruiter') { onNavigate('login'); return; }
            content = views.renderRecruiterDashboardContent(handlers);
            break;
        case 'about':
            content = views.renderAboutPageContent(handlers);
            break;
        default:
            content = createEl('div', 'p-16 text-center text-red-500', '404 Page Not Found');
    }
    
    root.appendChild(content);
    
    // 3. Render Footer (always visible)
    root.appendChild(views.renderFooter(handlers));
    
    document.querySelectorAll('.animate-scaleIn, .animate-slideRight').forEach(el => {
        el.style.opacity = 1; 
    });
}

// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', renderApp);