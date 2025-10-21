// --- 1. APPLICATION STATE & STORAGE ---
export let currentPage = 'home';
export let showNotifications = false;

// --- AUTHENTICATION STATE ---
export let authState = {
    isLoggedIn: localStorage.getItem('quickHireCurrentUser') ? true : false,
    currentUser: JSON.parse(localStorage.getItem('quickHireCurrentUser')),
    authMode: 'login', // 'login' or 'register'
    registerUserType: 'seeker', // 'seeker' or 'recruiter'
    loginFormData: { email: '', password: '', type: 'seeker' },
    registerFormData: { 
        name: '', email: '', password: '', 
        skills: '', location: '', companyName: '' 
    },
};

// State for JobsPage filtering
export let jobsPageState = {
    searchTerm: '',
    locationFilter: '',
    typeFilter: '',
    categoryFilter: '',
    appliedJobs: new Set(), // Initialized by initializeJobsPageState
};

// State for RecruiterDashboard
export let recruiterPageState = {
    showForm: false,
    applicationFilterStatus: '', // 'Pending', 'Shortlisted', 'Rejected', 'Hired'
    reviewingApplicationId: null, // ID of the application currently in the modal
    interviewDateDraft: '',
    interviewDateDraftValue: '', // State for interview date draft
    formData: {
        title: '', company: '', location: '', type: 'Full-Time', category: '', skills: '', salary: '', description: '',
    }
};

// --- Dashboard specific data mapping (Constants) ---
export const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Shortlisted: 'bg-blue-100 text-blue-800',
    Hired: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

export const statusIcons = {
    Pending: 'icon-clock',
    Shortlisted: 'icon-trending-up',
    Hired: 'icon-check-circle',
    Rejected: 'icon-x-circle',
};

export const statMap = [
    { label: 'Total Applications', iconClass: 'icon-briefcase', color: 'blue', delay: 0 },
    { label: 'Pending', iconClass: 'icon-clock', color: 'yellow', delay: 100 },
    { label: 'Shortlisted', iconClass: 'icon-trending-up', color: 'blue', delay: 200 },
    { label: 'Hired', iconClass: 'icon-check-circle', color: 'green', delay: 300 },
    { label: 'Rejected', iconClass: 'icon-x-circle', color: 'red', delay: 400 },
];

export const recruiterStatMap = [
    { label: 'Total Jobs Posted', key: 'totalJobs', iconClass: 'icon-briefcase', color: 'blue', delay: 0 },
    { label: 'Total Applications', key: 'totalApplications', iconClass: 'icon-users-large', color: 'green', delay: 100 },
    { label: 'Pending Review', key: 'pending', iconClass: 'icon-clock', color: 'yellow', delay: 200 },
    { label: 'Shortlisted', key: 'shortlisted', iconClass: 'icon-trending-up', color: 'purple', delay: 300 },
];


// --- MUTATOR FUNCTIONS (for clean state updates) ---
export function updateCurrentPage(page) {
    currentPage = page;
}

export function updateShowNotifications(value) {
    showNotifications = value;
}

export function toggleShowNotifications() {
    showNotifications = !showNotifications;
}

export function updateAuthState(newAuthState) {
    authState = newAuthState;
}