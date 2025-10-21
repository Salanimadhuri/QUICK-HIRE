import * as state from './state.js'; // Needed for initializeJobsPageState

// Default mock applications if localStorage is empty
const defaultApplications = [
    { id: 'app-1', jobId: 'job-101', jobTitle: "Cloud Architect", company: "Azure Solutions", status: "Shortlisted", appliedDate: "2025-09-01", applicantName: 'Kavya Sharma', applicantEmail: 'kavya@example.com', interviewDate: "2025-10-15T10:00:00" },
    { id: 'app-2', jobId: 'job-103', jobTitle: "Marketing Lead", company: "BrandPulse", status: "Pending", appliedDate: "2025-08-15", applicantName: 'Rahul Verma', applicantEmail: 'rahul@example.com' },
];

export const storage = {
    // --- User Auth ---
    getUsers: () => {
        try {
            const storedUsers = localStorage.getItem('quickHireUsers');
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch { return []; }
    },
    setUsers: (users) => {
        localStorage.setItem('quickHireUsers', JSON.stringify(users));
    },
    setCurrentUser: (user) => {
        localStorage.setItem('quickHireCurrentUser', JSON.stringify(user));
        // Update state directly
        state.authState.currentUser = user;
        state.authState.isLoggedIn = true;
    },
    clearCurrentUser: () => {
        localStorage.removeItem('quickHireCurrentUser');
        // Update state directly
        state.authState.currentUser = null;
        state.authState.isLoggedIn = false;
    },
    // --- Applications ---
    getApplications: () => {
        try {
            const storedApps = localStorage.getItem('quickHireApplications');
            return storedApps ? JSON.parse(storedApps) : defaultApplications;
        } catch {
            return defaultApplications;
        }
    },
    addApplication: (application) => {
        const currentApps = storage.getApplications();
        // Simply add the new application to the list
        const updatedApps = [...currentApps, application];
        localStorage.setItem('quickHireApplications', JSON.stringify(updatedApps));
    },
    updateApplicationStatus: (appId, status, interviewDate = null) => {
        const currentApps = storage.getApplications();
        const updatedApps = currentApps.map(app => {
            if (app.id === appId) {
                return { 
                    ...app, 
                    status: status,
                    // Set interview date ONLY if shortlisting, otherwise set to null
                    interviewDate: status === 'Shortlisted' ? interviewDate : null 
                };
            }
            return app;
        });
        localStorage.setItem('quickHireApplications', JSON.stringify(updatedApps));
    },
    // --- Job Management ---
    getRecruiterJobs: () => {
        try {
            const storedJobs = localStorage.getItem('quickHireRecruiterJobs');
            return storedJobs ? JSON.parse(storedJobs) : [];
        } catch {
            return [];
        }
    },
    setRecruiterJobs: (jobs) => {
        localStorage.setItem('quickHireRecruiterJobs', JSON.stringify(jobs));
    },
    // **NEW**: Delete Job and its applications
    deleteJob: (jobId) => {
        let currentJobs = storage.getRecruiterJobs();
        let currentApps = storage.getApplications();

        // Filter out the job to be deleted
        const updatedJobs = currentJobs.filter(job => job.id !== jobId);
        storage.setRecruiterJobs(updatedJobs);

        // Filter out applications associated with the deleted job
        const updatedApps = currentApps.filter(app => app.jobId !== jobId);
        localStorage.setItem('quickHireApplications', JSON.stringify(updatedApps));
    },

    // --- Notification Management ---
    getNotifications: () => {
        try {
            const storedNotifs = localStorage.getItem('quickHireNotifications');
            return storedNotifs ? JSON.parse(storedNotifs) : [];
        } catch {
            return [];
        }
    },
    setNotifications: (notifications) => {
        localStorage.setItem('quickHireNotifications', JSON.stringify(notifications));
    },
    addNotification: (notification) => {
        const currentNotifications = storage.getNotifications();
        const updatedNotifications = [notification, ...currentNotifications];
        storage.setNotifications(updatedNotifications);
    },
    // **NEW**: Clear notifications for a specific user
    clearNotifications: (userEmail) => {
        const allNotifications = storage.getNotifications();
        const remainingNotifications = allNotifications.filter(n => n.recipientEmail !== userEmail);
        storage.setNotifications(remainingNotifications);
    },
    clearNotificationById: (notificationId) => {
        const allNotifications = storage.getNotifications();
        const remainingNotifications = allNotifications.filter(n => n.id !== notificationId);
        storage.setNotifications(remainingNotifications);
    },
};

// Function to initialize appliedJobs state for the JobsPage
export function initializeJobsPageState() {
    const applications = storage.getApplications();
    const currentUser = state.authState.currentUser;

    if (currentUser && currentUser.type === 'seeker') {
        // If a seeker is logged in, only find jobs *they* applied to
        state.jobsPageState.appliedJobs = new Set(
            applications
                .filter(app => app.applicantEmail === currentUser.email)
                .map(app => app.jobId)
        );
    } else {
        // If no one is logged in, or it's a recruiter, the set is empty
        state.jobsPageState.appliedJobs = new Set();
    }
}