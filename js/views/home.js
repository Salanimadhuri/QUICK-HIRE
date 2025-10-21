import { createEl } from '../utils.js';
import { storage } from '../storage.js';

export function renderHomePageContent(handlers) {
    const { onNavigate } = handlers;
    
    const allJobs = storage.getRecruiterJobs();
    const topJobs = allJobs.slice(-3).reverse();
    const containerDiv = createEl('div', 'animate-fadeIn');

    const heroSection = createEl('section', 'relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden');
    heroSection.appendChild(createEl('div', 'absolute inset-0 bg-grid-pattern opacity-10'));
    const heroContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative');
    const heroTextCenter = createEl('div', 'text-center animate-slideUp');
    const heroTitle = createEl('h1', 'text-5xl md:text-6xl font-bold text-gray-900 mb-6', `<span class="block">Find Your Next Job</span><span class="block text-blue-600 mt-2">Fast with Quick Hire</span>`, true);
    heroTextCenter.appendChild(heroTitle);
    heroTextCenter.appendChild(createEl('p', 'text-xl text-gray-700 mb-10 max-w-3xl mx-auto', 'Connect with top employers and discover opportunities that match your skills and ambitions'));
    const heroButtons = createEl('div', 'flex flex-col sm:flex-row gap-4 justify-center items-center');
    const jobSeekerBtn = createEl('button', 'px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300', "I'm a Job Seeker");
    jobSeekerBtn.onclick = () => onNavigate('jobs');
    const recruiterBtn = createEl('button', 'px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300', "I'm a Recruiter");
    recruiterBtn.onclick = () => onNavigate('recruiter');
    heroButtons.appendChild(jobSeekerBtn);
    heroButtons.appendChild(recruiterBtn);
    heroTextCenter.appendChild(heroButtons);
    heroContainer.appendChild(heroTextCenter);
    heroSection.appendChild(heroContainer);
    containerDiv.appendChild(heroSection);

    const statsData = [
        { iconClass: 'icon-briefcase', number: '10K+', label: 'Active Jobs' },
        { iconClass: 'icon-users-large', number: '5K+', label: 'Companies' },
        { iconClass: 'icon-trending-up', number: '50K+', label: 'Job Seekers' },
        { iconClass: 'icon-award-large', number: '95%', label: 'Success Rate' },
    ];
    const statsSection = createEl('section', 'py-16 bg-white');
    const statsContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const statsGrid = createEl('div', 'grid grid-cols-2 md:grid-cols-4 gap-8');
    statsData.forEach((stat, index) => {
        const statDiv = createEl('div', 'text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn');
        statDiv.style.animationDelay = `${index * 100}ms`;
        const icon = createEl('div', `icon ${stat.iconClass} w-10 h-10 mx-auto text-white mb-3 text-blue-600-icon`);
        icon.style.width = '40px'; icon.style.height = '40px';
        statDiv.appendChild(icon);
        statDiv.appendChild(createEl('div', 'text-3xl font-bold text-blue-600', stat.number));
        statDiv.appendChild(createEl('div', 'text-gray-600 mt-1', stat.label));
        statsGrid.appendChild(statDiv);
    });
    statsContainer.appendChild(statsGrid);
    statsSection.appendChild(statsContainer);
    containerDiv.appendChild(statsSection);

    // --- "Why Choose Us" Section (Features) ---
    const featuresData = [
        { title: 'Smart Job Matching', desc: 'AI-powered algorithms match you with perfect opportunities' },
        { title: 'Fast & Efficient', desc: 'Streamlined process saves time for both seekers and recruiters' },
        { title: 'Real-time Analytics', desc: 'Track your applications and get instant updates' },
        { title: 'Quality Assured', desc: 'Verified companies and thoroughly screened candidates' },
    ];
    const featuresSection = createEl('section', 'py-16 bg-gray-50');
    const featuresContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const featuresHeader = createEl('div', 'text-center mb-12');
    featuresHeader.appendChild(createEl('h2', 'text-4xl font-bold text-gray-900 mb-4', 'Why Choose Quick Hire?'));
    featuresHeader.appendChild(createEl('p', 'text-xl text-gray-600 max-w-2xl mx-auto', "We're revolutionizing the hiring process with cutting-edge technology"));
    featuresContainer.appendChild(featuresHeader);
    const featuresGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-4 gap-8');
    featuresData.forEach((feature, index) => {
        const card = createEl('div', 'bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp');
        card.style.animationDelay = `${index * 100}ms`;
        const iconCircle = createEl('div', 'w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center');
        iconCircle.appendChild(createEl('div', `icon ${['icon-cog', 'icon-clock', 'icon-trending-up', 'icon-check-circle'][index]} w-8 h-8 text-white text-blue-600-icon`)); 
        card.appendChild(iconCircle);
        card.appendChild(createEl('h3', 'text-xl font-bold text-gray-900 mb-3 text-center', feature.title));
        card.appendChild(createEl('p', 'text-gray-600 text-center', feature.desc));
        featuresGrid.appendChild(card);
    });
    featuresContainer.appendChild(featuresGrid);
    featuresSection.appendChild(featuresContainer);
    containerDiv.appendChild(featuresSection);

    const jobsSection = createEl('section', 'py-16 bg-white');
    const jobsContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const jobsHeader = createEl('div', 'text-center mb-12');
    jobsHeader.appendChild(createEl('h2', 'text-4xl font-bold text-gray-900 mb-4', 'Featured Jobs'));
    jobsHeader.appendChild(createEl('p', 'text-xl text-gray-600', 'Start your journey with these top opportunities'));
    jobsContainer.appendChild(jobsHeader);
    const jobsGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-6');
    if (topJobs.length > 0) {
        topJobs.forEach((job, index) => {
            const card = createEl('div', 'bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp');
            card.style.animationDelay = `${index * 100}ms`;
            card.appendChild(createEl('h3', 'text-xl font-bold text-gray-900 mb-2', job.title));
            card.appendChild(createEl('p', 'text-blue-600 font-semibold mb-3', job.company));
            const jobDetails = createEl('div', 'space-y-2 text-sm text-gray-600 mb-4');
            jobDetails.appendChild(createEl('p', '', job.location));
            jobDetails.appendChild(createEl('p', '', `${job.type} • ${job.salary}`));
            card.appendChild(jobDetails);
            const skillTags = createEl('div', 'flex flex-wrap gap-2 mb-4');
            job.skills.slice(0, 3).forEach(skill => skillTags.appendChild(createEl('span', 'px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm', skill)));
            card.appendChild(skillTags);
            const viewDetailsBtn = createEl('button', 'w-full py-2 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors', 'View Details');
            viewDetailsBtn.onclick = () => onNavigate('jobs');
            card.appendChild(viewDetailsBtn);
            jobsGrid.appendChild(card);
        });
    } else {
        jobsGrid.className = '';
        jobsGrid.appendChild(createEl('p', 'text-center text-gray-500 col-span-3', 'No jobs have been posted yet. Recruiters, post a job to feature it here!'));
    }
    jobsContainer.appendChild(jobsGrid);
    const viewAllBtnWrapper = createEl('div', 'text-center mt-12');
    const viewAllBtn = createEl('button', 'px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all', 'View All Jobs');
    viewAllBtn.onclick = () => onNavigate('jobs');
    viewAllBtnWrapper.appendChild(viewAllBtn);
    jobsContainer.appendChild(viewAllBtnWrapper);
    jobsSection.appendChild(jobsContainer);
    containerDiv.appendChild(jobsSection);

    return containerDiv;
}