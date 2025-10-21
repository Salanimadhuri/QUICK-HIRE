import { createEl } from '../utils.js';
import * as state from '../state.js';
import { storage, initializeJobsPageState } from '../storage.js';

export function renderJobsPageContent(handlers) {
    const { handleFilterChange, handleClearFilters, handleApply } = handlers;
    
    initializeJobsPageState();
    const { searchTerm, locationFilter, typeFilter, categoryFilter, appliedJobs } = state.jobsPageState;
    let filteredJobs = storage.getRecruiterJobs();

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(j => j.title.toLowerCase().includes(term) || j.company.toLowerCase().includes(term) || j.skills.some(s => s.toLowerCase().includes(term)));
    }
    if (locationFilter) filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
    if (typeFilter) filteredJobs = filteredJobs.filter(j => j.type === typeFilter);
    if (categoryFilter) filteredJobs = filteredJobs.filter(j => j.category === categoryFilter);

    const appContent = createEl('div', 'min-h-screen bg-gray-50 py-8 animate-fadeIn');
    const container = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');

    const headerDiv = createEl('div', 'mb-8 animate-slideDown');
    headerDiv.appendChild(createEl('h1', 'text-4xl font-bold text-gray-900 mb-4', 'Find Your Dream Job'));
    headerDiv.appendChild(createEl('p', 'text-xl text-gray-600', `Browse ${filteredJobs.length} opportunities that match your skills`));
    container.appendChild(headerDiv);

    const filterBar = createEl('div', 'bg-white rounded-xl shadow-md p-6 mb-8 animate-slideUp');
    const filterGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-5 gap-4');

    const searchWrapper = createEl('div', 'lg:col-span-2 relative');
    searchWrapper.appendChild(createEl('div', 'icon icon-search w-5 h-5 absolute left-3 top-3.5 text-white text-gray-400-icon'));
    const searchInput = createEl('input', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all');
    searchInput.type = 'text'; searchInput.placeholder = 'Search jobs, skills, or companies...'; searchInput.value = searchTerm;
    searchInput.oninput = (e) => handleFilterChange('searchTerm', e.target.value);
    searchWrapper.appendChild(searchInput);
    filterGrid.appendChild(searchWrapper);

    const locationWrapper = createEl('div', 'relative');
    locationWrapper.appendChild(createEl('div', 'icon icon-map-pin w-5 h-5 absolute left-3 top-3.5 text-white text-gray-400-icon'));
    const locationInput = createEl('input', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all');
    locationInput.type = 'text'; locationInput.placeholder = 'Location'; locationInput.value = locationFilter;
    locationInput.oninput = (e) => handleFilterChange('locationFilter', e.target.value);
    locationWrapper.appendChild(locationInput);
    filterGrid.appendChild(locationWrapper);

    const typeWrapper = createEl('div', 'relative');
    typeWrapper.appendChild(createEl('div', 'icon icon-briefcase w-5 h-5 absolute left-3 top-3.5 text-white text-gray-400-icon'));
    const typeSelect = createEl('select', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none');
    typeSelect.value = typeFilter; typeSelect.onchange = (e) => handleFilterChange('typeFilter', e.target.value);
    typeSelect.innerHTML = `<option value="">Job Type</option><option>Full-Time</option><option>Part-time</option><option>Contract</option><option>Remote</option>`;
    typeWrapper.appendChild(typeSelect);
    filterGrid.appendChild(typeWrapper);

    const categoryWrapper = createEl('div', 'relative');
    categoryWrapper.appendChild(createEl('div', 'icon icon-filter w-5 h-5 absolute left-3 top-3.5 text-white text-gray-400-icon'));
    const categorySelect = createEl('select', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none');
    categorySelect.value = categoryFilter; categorySelect.onchange = (e) => handleFilterChange('categoryFilter', e.target.value);
    categorySelect.innerHTML = `<option value="">Category</option><option>IT</option><option>Marketing</option><option>Design</option><option>HR</option>`;
    categoryWrapper.appendChild(categorySelect);
    filterGrid.appendChild(categoryWrapper);
    
    filterBar.appendChild(filterGrid);
    container.appendChild(filterBar);

    const jobGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-3 gap-6');
    filteredJobs.forEach((job, index) => {
        const isApplied = appliedJobs.has(job.id);
        const card = createEl('div', 'bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 animate-scaleIn');
        card.style.animationDelay = `${index * 50}ms`;
        const header = createEl('div', 'flex justify-between items-start mb-4');
        const titleInfo = createEl('div');
        titleInfo.appendChild(createEl('h3', 'text-xl font-bold text-gray-900 mb-1', job.title));
        titleInfo.appendChild(createEl('p', 'text-blue-600 font-semibold', job.company));
        const typeTag = createEl('span', 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold', job.type);
        header.appendChild(titleInfo); header.appendChild(typeTag); card.appendChild(header);
        const details = createEl('div', 'space-y-2 text-sm text-gray-600 mb-4');
        const locationDetail = createEl('div', 'flex items-center');
        locationDetail.appendChild(createEl('div', 'icon icon-map-pin w-4 h-4 mr-2 text-white text-gray-400-icon'));
        locationDetail.appendChild(document.createTextNode(job.location));
        details.appendChild(locationDetail);
        details.appendChild(createEl('p', 'font-semibold text-gray-900', job.salary));
        card.appendChild(details);
        card.appendChild(createEl('p', 'text-gray-600 text-sm mb-4 line-clamp-2', job.description));
        const skillTags = createEl('div', 'flex flex-wrap gap-2 mb-4');
        job.skills.forEach(skill => skillTags.appendChild(createEl('span', 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs', skill)));
        card.appendChild(skillTags);
        const buttonClass = isApplied ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg transform hover:-translate-y-1';
        const applyBtn = createEl('button', `w-full py-3 rounded-lg font-semibold transition-all duration-300 ${buttonClass}`, isApplied ? 'Applied' : 'Apply Now');
        if (!isApplied) { applyBtn.onclick = () => handleApply(job); } else { applyBtn.disabled = true; }
        card.appendChild(applyBtn);
        jobGrid.appendChild(card);
    });
    container.appendChild(jobGrid);

    if (filteredJobs.length === 0) {
        const noResults = createEl('div', 'text-center py-16 animate-fadeIn');
        noResults.appendChild(createEl('p', 'text-2xl text-gray-600', 'No jobs found matching your criteria'));
        const clearBtn = createEl('button', 'mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors', 'Clear Filters');
        clearBtn.onclick = handleClearFilters;
        noResults.appendChild(clearBtn);
        container.appendChild(noResults);
    }

    appContent.appendChild(container);
    return appContent;
}