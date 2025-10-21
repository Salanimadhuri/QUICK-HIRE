import { createEl, createStatusTag } from '../utils.js';
import * as state from '../state.js';
import { storage } from '../storage.js';

export function renderRecruiterDashboardContent(handlers) {
    const { 
        togglePostJobForm, 
        handleRecruiterFormSubmit, 
        handleDeleteJob, 
        setReviewingApplication, 
        updateApplicationStatus,
        handleRecruiterFormChange,
        setShortlistMode
    } = handlers;

    const postedJobs = storage.getRecruiterJobs().filter(j => j.recruiterId === state.authState.currentUser.id);
    const applications = storage.getApplications();
    const { showForm, formData, applicationFilterStatus, reviewingApplicationId } = state.recruiterPageState;
    
    const recruiterJobIds = postedJobs.map(job => job.id);
    let relevantApplications = applications.filter(app => recruiterJobIds.includes(app.jobId));
    
    if (applicationFilterStatus) {
        relevantApplications = relevantApplications.filter(app => app.status === applicationFilterStatus);
    }
    
    const stats = {
        totalJobs: postedJobs.length,
        totalApplications: applications.filter(app => recruiterJobIds.includes(app.jobId)).length,
        pending: applications.filter(app => recruiterJobIds.includes(app.jobId) && app.status === 'Pending').length,
        shortlisted: applications.filter(app => recruiterJobIds.includes(app.jobId) && app.status === 'Shortlisted').length,
    };
    
    const applicationsByJob = postedJobs.reduce((acc, job) => {
        acc[job.id] = { job, applications: relevantApplications.filter(app => app.jobId === job.id) };
        return acc;
    }, {});

    const applicationToReview = applications.find(app => app.id === reviewingApplicationId);

    const appContent = createEl('div', 'min-h-screen bg-gray-50 py-8 animate-fadeIn');
    const container = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');

    const headerFlex = createEl('div', 'flex justify-between items-center mb-8 animate-slideDown');
    const headerDiv = createEl('div');
    headerDiv.appendChild(createEl('h1', 'text-4xl font-bold text-gray-900 mb-2', 'Recruiter Dashboard'));
    headerDiv.appendChild(createEl('p', 'text-xl text-gray-600', `Managing ${postedJobs.length} job postings`));
    headerFlex.appendChild(headerDiv);

    const postJobBtn = createEl('button', 'flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300', '', true);
    postJobBtn.onclick = togglePostJobForm;
    postJobBtn.innerHTML = '<div class="icon icon-plus w-5 h-5 mr-2 text-white text-white-icon"></div> Post New Job'; 
    headerFlex.appendChild(postJobBtn);
    container.appendChild(headerFlex);

    const statsGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8');
    state.recruiterStatMap.forEach(stat => {
        const card = createEl('div', `bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 animate-scaleIn`);
        card.style.animationDelay = `${stat.delay}ms`;
        const content = createEl('div', 'flex items-center justify-between mb-3');
        const IconDiv = createEl('div', `icon ${stat.iconClass} w-8 h-8 text-white text-${stat.color}-600-icon`);
        const valueDiv = createEl('div', `text-3xl font-bold text-${stat.color}-600`, stats[stat.key].toString());
        content.appendChild(IconDiv); content.appendChild(valueDiv); card.appendChild(content);
        card.appendChild(createEl('p', 'text-gray-600 text-sm font-medium', stat.label));
        statsGrid.appendChild(card);
    });
    container.appendChild(statsGrid);

    if (showForm) {
        const formWrapper = createEl('div', 'bg-white rounded-xl shadow-md p-8 mb-8 animate-slideDown');
        formWrapper.appendChild(createEl('h2', 'text-2xl font-bold text-gray-900 mb-6', 'Post a New Job'));
        
        const form = createEl('form', 'space-y-6');
        form.onsubmit = handleRecruiterFormSubmit;

        const inputGrid = createEl('div', 'grid md:grid-cols-2 gap-6');
        const inputFields = [
            { label: 'Job Title', name: 'title', placeholder: 'e.g., Senior Frontend Developer', key: 'title' },
            { label: 'Company Name', name: 'company', placeholder: 'e.g., TechCorp', key: 'company' },
            { label: 'Location', name: 'location', placeholder: 'e.g., Bangalore, Karnataka', key: 'location' },
            { label: 'Salary Range', name: 'salary', placeholder: 'e.g., ₹15 - ₹25 LPA', key: 'salary' },
            { label: 'Category', name: 'category', placeholder: 'e.g., IT, Marketing', key: 'category' }
        ];

        inputFields.forEach(field => {
            const div = createEl('div');
            div.appendChild(createEl('label', 'block text-sm font-semibold text-gray-700 mb-2', field.label));
            const input = createEl('input', 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500');
            input.type = 'text'; input.name = field.name; input.required = true; input.placeholder = field.placeholder;
            input.value = formData[field.key];
            input.oninput = (e) => handleRecruiterFormChange(field.key, e.target.value);
            div.appendChild(input);
            inputGrid.appendChild(div);
        });
        
        const typeDiv = createEl('div');
        typeDiv.appendChild(createEl('label', 'block text-sm font-semibold text-gray-700 mb-2', 'Job Type'));
        const typeSelect = createEl('select', 'w-full px-4 py-3 border border-gray-300 rounded-lg');
        typeSelect.name = 'type'; typeSelect.onchange = (e) => handleRecruiterFormChange('type', e.target.value);
        typeSelect.innerHTML = `<option>Full-Time</option><option>Part-time</option><option>Contract</option><option>Remote</option>`;
        typeSelect.value = formData.type;
        typeDiv.appendChild(typeSelect);
        inputGrid.appendChild(typeDiv);
        form.appendChild(inputGrid);
        
        const skillsDiv = createEl('div');
        skillsDiv.appendChild(createEl('label', 'block text-sm font-semibold text-gray-700 mb-2', 'Required Skills (comma-separated)'));
        const skillsInput = createEl('input', 'w-full px-4 py-3 border border-gray-300 rounded-lg');
        skillsInput.type = 'text'; skillsInput.name = 'skills'; skillsInput.required = true; skillsInput.placeholder = 'e.g., React, TypeScript, Node.js';
        skillsInput.value = formData.skills;
        skillsInput.oninput = (e) => handleRecruiterFormChange('skills', e.target.value);
        skillsDiv.appendChild(skillsInput);
        form.appendChild(skillsDiv);

        const descDiv = createEl('div');
        descDiv.appendChild(createEl('label', 'block text-sm font-semibold text-gray-700 mb-2', 'Job Description'));
        const descTextarea = createEl('textarea', 'w-full px-4 py-3 border border-gray-300 rounded-lg');
        descTextarea.name = 'description'; descTextarea.required = true; descTextarea.rows = 4;
        descTextarea.placeholder = 'Describe the role, responsibilities, and requirements...';
        descTextarea.value = formData.description;
        descTextarea.oninput = (e) => handleRecruiterFormChange('description', e.target.value);
        descDiv.appendChild(descTextarea);
        form.appendChild(descDiv);

        const buttonsDiv = createEl('div', 'flex gap-4');
        const submitBtn = createEl('button', 'flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold', 'Post Job');
        submitBtn.type = 'submit';
        const cancelBtn = createEl('button', 'px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold', 'Cancel');
        cancelBtn.type = 'button'; cancelBtn.onclick = togglePostJobForm;
        buttonsDiv.appendChild(submitBtn); buttonsDiv.appendChild(cancelBtn);
        form.appendChild(buttonsDiv);
        formWrapper.appendChild(form);
        container.appendChild(formWrapper);
    }

    const filterDiv = createEl('div', 'bg-white rounded-xl shadow-md p-6 mb-8 animate-slideUp');
    filterDiv.appendChild(createEl('h2', 'text-2xl font-bold text-gray-900 mb-4', 'Applications by Status'));
    const filterControls = createEl('div', 'flex space-x-4 mb-4 overflow-x-auto pb-2');
    const statusOptions = ['All', 'Pending', 'Shortlisted', 'Rejected', 'Hired'];
    statusOptions.forEach(status => {
        const isActive = (applicationFilterStatus === '' ? 'All' : applicationFilterStatus) === status;
        const button = createEl('button', `min-w-max px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-50'}`);
        button.textContent = status;
        button.onclick = () => { state.recruiterPageState.applicationFilterStatus = status === 'All' ? '' : status; handlers.onNavigate('recruiter'); /* a bit of a hack to force re-render */ };
        filterControls.appendChild(button);
    });
    filterDiv.appendChild(filterControls);
    container.appendChild(filterDiv);

    const postedJobsCard = createEl('div', 'bg-white rounded-xl shadow-md p-6 animate-slideUp');
    if (postedJobs.length === 0) {
        const emptyState = createEl('div', 'text-center py-12');
        emptyState.appendChild(createEl('div', 'icon icon-briefcase w-12 h-12 mx-auto text-white text-gray-400-icon mb-4'));
        emptyState.appendChild(createEl('p', 'text-gray-600 text-lg mb-2', 'No jobs posted yet'));
        emptyState.appendChild(createEl('p', 'text-gray-500', 'Click "Post New Job" to get started'));
        postedJobsCard.appendChild(emptyState);
    } else {
        const jobListContainer = createEl('div', 'space-y-8');
        let foundRelevantJobs = false;
        Object.values(applicationsByJob).forEach(({ job, applications }) => {
            if (applications.length === 0 && applicationFilterStatus !== '') return;
            foundRelevantJobs = true;

            const jobWrapper = createEl('div', 'border border-gray-200 rounded-xl p-6');
            const jobHeader = createEl('div', 'flex justify-between items-center mb-1');
            jobHeader.appendChild(createEl('h3', 'text-xl font-bold text-gray-900', `${job.title} (${applications.length} Applicants)`));

            const deleteBtn = createEl('button', 'p-2 rounded-full hover:bg-red-100 transition-colors');
            deleteBtn.title = `Delete ${job.title}`;
            deleteBtn.onclick = (e) => { e.stopPropagation(); handleDeleteJob(job.id, job.title); };
            deleteBtn.appendChild(createEl('div', 'icon icon-trash w-4 h-4 text-white text-red-600-icon'));
            jobHeader.appendChild(deleteBtn);
            jobWrapper.appendChild(jobHeader);
            
            jobWrapper.appendChild(createEl('p', 'text-sm text-gray-600 mb-4', `Company: ${job.company} | Location: ${job.location}`));
            
            const appList = createEl('div', 'space-y-4');
            if (applications.length === 0) {
                appList.appendChild(createEl('p', 'text-gray-500 p-4 bg-gray-50 rounded-lg', 'No applicants match the current filter.'));
            } else {
                applications.forEach(app => {
                    const appItem = createEl('div', 'flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer');
                    appItem.onclick = () => setReviewingApplication(app.id);
                    const infoDiv = createEl('div');
                    infoDiv.appendChild(createEl('h4', 'font-semibold text-gray-900', app.applicantName));
                    infoDiv.appendChild(createEl('p', 'text-sm text-gray-600', app.applicantEmail));
                    const statusWrapper = createEl('div', 'flex items-center space-x-2');
                    statusWrapper.appendChild(createStatusTag(app.status));
                    if (app.status === 'Pending' || app.status === 'Shortlisted') {
                        statusWrapper.appendChild(createEl('button', 'text-blue-600 hover:text-blue-800 text-sm font-semibold', 'Review'));
                    }
                    appItem.appendChild(infoDiv);
                    appItem.appendChild(statusWrapper);
                    appList.appendChild(appItem);
                });
            }
            jobWrapper.appendChild(appList);
            jobListContainer.appendChild(jobWrapper);
        });
        
        if (!foundRelevantJobs) {
             jobListContainer.appendChild(createEl('p', 'text-center py-12 text-gray-600 text-lg', 'No jobs found matching the application filters.'));
        }
        postedJobsCard.appendChild(jobListContainer);
    }
    container.appendChild(postedJobsCard);

    if (applicationToReview) {
        appContent.appendChild(renderApplicationReviewModal(applicationToReview, handlers));
    }

    appContent.appendChild(container);
    return appContent;
}

// This modal is part of the recruiter dashboard, so it stays in this file.
function renderApplicationReviewModal(app, handlers) {
    const { setReviewingApplication, updateApplicationStatus, handleInterviewDateChange ,setShortlistMode} = handlers;
    
    const modalBackdrop = createEl('div', 'modal-backdrop animate-fadeIn');

    const modalContent = createEl(
        'div',
        'bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all animate-slideUp'
    );
    modalContent.style.animationDuration = '0.3s';

    const isSettingInterview = state.recruiterPageState.interviewDateDraft === 'draft';

    if (isSettingInterview) {
        modalContent.appendChild(createEl('h3', 'text-2xl font-bold text-gray-900 mb-4', 'Schedule Interview'));
        modalContent.appendChild(createEl('p', 'text-lg text-blue-600 font-semibold mb-6', app.applicantName));
        modalContent.appendChild(createEl('p', 'block text-sm font-semibold text-gray-700 mb-2', 'Interview Date & Time (Required)'));

        // Create datetime-local input
        const dateInput = createEl('input', 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all mb-4');
        dateInput.type = 'datetime-local';
        dateInput.min = new Date().toISOString().slice(0, 16);
        dateInput.value = state.recruiterPageState.interviewDateDraftValue || '';
        dateInput.onchange = handleInterviewDateChange; // Use the handler from app.js

        modalContent.appendChild(dateInput);

        // Buttons
        const actions = createEl('div', 'flex gap-4 mt-4');

        const confirmShortlistBtn = createEl(
            'button',
            'flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all',
            'Confirm Shortlist'
        );
        confirmShortlistBtn.disabled = !dateInput.value;

        const cancelBtn = createEl(
            'button',
            'flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all',
            'Cancel'
        );

        confirmShortlistBtn.onclick = () => {
            if (!dateInput.value) {
                alert("Please select a valid interview date to shortlist the candidate.");
                return;
            }
            
            // Format the date properly for storage
            const selectedDate = new Date(dateInput.value);
            const formattedDate = selectedDate.toISOString();
            
            updateApplicationStatus(app.id, 'Shortlisted', true, formattedDate);
        };

        cancelBtn.onclick = () => {
            state.recruiterPageState.interviewDateDraft = '';
            state.recruiterPageState.interviewDateDraftValue = '';
            setReviewingApplication(null);
        };

        actions.appendChild(confirmShortlistBtn);
        actions.appendChild(cancelBtn);
        modalContent.appendChild(actions);

    } else {
        // --- Normal Review UI ---
        modalContent.appendChild(createEl('h3', 'text-2xl font-bold text-gray-900 mb-2', 'Reviewing Application'));
        modalContent.appendChild(createEl('p', 'text-lg text-blue-600 font-semibold mb-6', app.jobTitle));

        const infoGrid = createEl('div', 'space-y-3 p-4 bg-gray-50 rounded-lg mb-6');
        infoGrid.innerHTML = `
            <p><strong>Applicant:</strong> ${app.applicantName}</p>
            <p><strong>Email:</strong> ${app.applicantEmail}</p>
            <p><strong>Applied On:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</p>
            <div class="flex items-center"><strong>Current Status:</strong></div>
        `;
        infoGrid.lastElementChild.appendChild(createStatusTag(app.status));
        modalContent.appendChild(infoGrid);

        const actions = createEl('div', 'grid grid-cols-2 gap-4');

        const shortlistBtn = createEl(
            'button',
            'w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400',
            'Shortlist & Schedule'
        );
        shortlistBtn.disabled = app.status !== 'Pending';
       shortlistBtn.onclick = () => {
            setShortlistMode(app.id);
        };

        const rejectBtn = createEl(
            'button',
            'w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400',
            'Reject'
        );
        rejectBtn.disabled = app.status !== 'Pending';
        rejectBtn.onclick = () => updateApplicationStatus(app.id, 'Rejected');

        const hireBtn = createEl(
            'button',
            'w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400',
            'Hire Candidate'
        );
        hireBtn.disabled = app.status !== 'Shortlisted';
        hireBtn.onclick = () => updateApplicationStatus(app.id, 'Hired');

        const closeBtn = createEl(
            'button',
            'w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300',
            'Close Review'
        );
        closeBtn.onclick = () => setReviewingApplication(null);

        actions.appendChild(shortlistBtn);
        actions.appendChild(rejectBtn);
        actions.appendChild(hireBtn);
        actions.appendChild(closeBtn);
        modalContent.appendChild(actions);
    }

    modalBackdrop.appendChild(modalContent);
    return modalBackdrop;
}