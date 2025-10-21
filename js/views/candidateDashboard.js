import { createEl, createStatusTag } from '../utils.js';
import * as state from '../state.js';
import { storage } from '../storage.js';

export function renderCandidateDashboardContent(handlers) {
    const applications = storage.getApplications().filter(app => app.applicantEmail === state.authState.currentUser.email);
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'Pending').length,
        shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
        hired: applications.filter(a => a.status === 'Hired').length,
        rejected: applications.filter(a => a.status === 'Rejected').length,
    };
    const upcomingInterviews = applications
        .filter(app => app.interviewDate && new Date(app.interviewDate) > new Date())
        .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime());
    
    const allJobs = storage.getRecruiterJobs();
    const recommendedJobs = allJobs.slice(-4).reverse();

    const appContent = createEl('div', 'min-h-screen bg-gray-50 py-8 animate-fadeIn');
    const container = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    
    const headerDiv = createEl('div', 'mb-8 animate-slideDown');
    headerDiv.appendChild(createEl('h1', 'text-4xl font-bold text-gray-900 mb-2', 'My Dashboard'));
    headerDiv.appendChild(createEl('p', 'text-xl text-gray-600', 'Track your applications and discover new opportunities'));
    container.appendChild(headerDiv);

    const statsGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8');
    state.statMap.forEach(stat => {
        const value = stat.label === 'Total Applications' ? stats.total : stats[stat.label.toLowerCase()];
        const card = createEl('div', `bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 animate-scaleIn`);
        card.style.animationDelay = `${stat.delay}ms`;
        const content = createEl('div', 'flex items-center justify-between mb-3');
        const IconDiv = createEl('div', `icon ${stat.iconClass} w-8 h-8 text-white text-${stat.color}-600-icon`);
        const valueDiv = createEl('div', `text-3xl font-bold text-${stat.color}-600`, value.toString());
        content.appendChild(IconDiv);
        content.appendChild(valueDiv);
        card.appendChild(content);
        card.appendChild(createEl('p', 'text-gray-600 text-sm font-medium', stat.label));
        statsGrid.appendChild(card);
    });
    container.appendChild(statsGrid);
    
    const mainGrid = createEl('div', 'grid lg:grid-cols-3 gap-8');

    const appCol = createEl('div', 'lg:col-span-2');
    const appCard = createEl('div', 'bg-white rounded-xl shadow-md p-6 mb-8 animate-slideUp');
    
    const appHeader = createEl('h2', 'text-2xl font-bold text-gray-900 mb-6 flex items-center');
    appHeader.appendChild(createEl('div', 'icon icon-briefcase w-7 h-7 mr-3 text-white text-blue-600-icon'));
    appHeader.appendChild(document.createTextNode('My Applications'));
    appCard.appendChild(appHeader);
    
    const appListContainer = createEl('div', 'space-y-4');
    if (applications.length === 0) {
        const emptyState = createEl('div', 'text-center py-12');
        emptyState.appendChild(createEl('p', 'text-gray-600 text-lg mb-4', "You haven't applied to any jobs yet"));
        emptyState.appendChild(createEl('p', 'text-gray-500', "Start exploring opportunities to see them here"));
        appListContainer.appendChild(emptyState);
    } else {
        applications.forEach((app, index) => {
            const card = createEl('div', 'border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-2 animate-slideRight');
            card.style.animationDelay = `${index * 50}ms`;
            const header = createEl('div', 'flex justify-between items-start mb-3');
            const infoDiv = createEl('div');
            infoDiv.appendChild(createEl('h3', 'text-lg font-bold text-gray-900', app.jobTitle));
            infoDiv.appendChild(createEl('p', 'text-blue-600 font-semibold', app.company));
            header.appendChild(infoDiv);
            header.appendChild(createStatusTag(app.status));
            card.appendChild(header);
            const datesDiv = createEl('div', 'text-sm text-gray-600');
            datesDiv.appendChild(createEl('p', '', `Applied on: ${new Date(app.appliedDate).toLocaleDateString()}`));
            if (app.interviewDate) {
                datesDiv.appendChild(createEl('p', 'text-green-600 font-semibold mt-1', `Interview: ${new Date(app.interviewDate).toLocaleString()}`));
            }
            card.appendChild(datesDiv);
            appListContainer.appendChild(card);
        });
    }
    appCard.appendChild(appListContainer);
    appCol.appendChild(appCard);
    mainGrid.appendChild(appCol);

    const sidebarCol = createEl('div', 'space-y-8');
    const interviewCard = createEl('div', 'bg-white rounded-xl shadow-md p-6 animate-slideLeft');
    const interviewHeader = createEl('h2', 'text-2xl font-bold text-gray-900 mb-6 flex items-center');
    interviewHeader.appendChild(createEl('div', 'icon icon-calendar w-7 h-7 mr-3 text-white text-blue-600-icon'));
    interviewHeader.appendChild(document.createTextNode('Upcoming Interviews'));
    interviewCard.appendChild(interviewHeader);
    
    if (upcomingInterviews.length === 0) {
        interviewCard.appendChild(createEl('p', 'text-gray-600 text-center py-4', 'No interviews scheduled'));
    } else {
        const interviewList = createEl('div', 'space-y-4');
        upcomingInterviews.forEach(interview => {
            const item = createEl('div', 'border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg');
            item.appendChild(createEl('h3', 'font-bold text-gray-900', interview.jobTitle));
            item.appendChild(createEl('p', 'text-blue-600 text-sm font-semibold', interview.company));
            item.appendChild(createEl('p', 'text-gray-600 text-sm mt-2', `${new Date(interview.interviewDate).toLocaleString()}`));
            interviewList.appendChild(item);
        });
        interviewCard.appendChild(interviewList);
    }
    sidebarCol.appendChild(interviewCard);

    const recCard = createEl('div', 'bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-md p-6 text-white animate-pulse-slow');
    recCard.appendChild(createEl('h2', 'text-2xl font-bold mb-4', 'Recommended For You'));
    const recList = createEl('div', 'space-y-3');
    if (recommendedJobs.length === 0) {
        recList.appendChild(createEl('p', 'text-xs opacity-90', 'No jobs have been posted yet. Check back soon!'));
    } else {
        recommendedJobs.forEach(job => {
            const item = createEl('div', 'bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 hover:bg-opacity-30 transition-all');
            item.appendChild(createEl('h3', 'font-bold text-sm', job.title));
            item.appendChild(createEl('p', 'text-xs opacity-90', job.company));
            item.appendChild(createEl('p', 'text-xs mt-1', job.salary));
            recList.appendChild(item);
        });
    }
    recCard.appendChild(recList);
    sidebarCol.appendChild(recCard);

    mainGrid.appendChild(sidebarCol);
    container.appendChild(mainGrid);
    appContent.appendChild(container);
    return appContent;
}