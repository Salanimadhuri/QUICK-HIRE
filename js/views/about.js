import { createEl } from '../utils.js';

export function renderAboutPageContent(handlers) {
    const containerDiv = createEl('div', 'min-h-screen bg-gray-50 animate-fadeIn');

    const missionVisionImpactData = [
        { iconClass: 'icon-target', title: 'Our Mission', desc: 'Connecting talent with opportunity efficiently, creating meaningful careers and thriving companies.', delay: 0, },
        { iconClass: 'icon-eye', title: 'Our Vision', desc: 'To make job searching and recruitment smarter, faster, and more human-centered globally.', delay: 100, },
        { iconClass: 'icon-trending-up', title: 'Our Impact', desc: '50K+ jobs matched | 5K+ companies served | 15 countries', delay: 200, },
    ];

    const valuesData = [
        { iconClass: 'icon-users-large', title: 'People First', desc: 'We prioritize human experience behind every application and hire.', delay: 0, },
        { iconClass: 'icon-cog', title: 'Precision Matching', desc: 'Smart algorithms to connect the right candidate to the right role.', delay: 100, },
        { iconClass: 'icon-shield', title: 'Trust & Transparency', desc: 'We maintain high standards of security and open communication.', delay: 200, },
        { iconClass: 'icon-lightbulb', title: 'Innovation', desc: 'Continuous improvement to meet the needs of the modern workforce.', delay: 300, },
    ];

    const teamData = [
        { name: 'Sarah Johnson', role: 'CEO & Co-Founder', delay: 0 },
        { name: 'Michael Chen', role: 'CTO & Co-Founder', delay: 100 },
        { name: 'Emily Rodriguez', role: 'Head of Product', delay: 200 },
        { name: 'David Kim', role: 'Head of Growth', delay: 300 },
    ];

    const heroSection = createEl('section', 'bg-gradient-to-br from-blue-600 to-blue-500 py-20 animate-slideDown');
    const heroContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center');
    heroContainer.appendChild(createEl('h1', 'text-5xl font-bold text-white mb-6', 'About Quick Hire'));
    heroContainer.appendChild(createEl('p', 'text-xl text-blue-100 max-w-3xl mx-auto', 'Connecting talent with opportunity efficiently, creating meaningful careers and thriving companies'));
    heroSection.appendChild(heroContainer);
    containerDiv.appendChild(heroSection);

    const mviSection = createEl('section', 'py-16');
    const mviContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const mviGrid = createEl('div', 'grid md:grid-cols-3 gap-8');

    missionVisionImpactData.forEach((item) => {
        const card = createEl('div', 'bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn');
        card.style.animationDelay = `${item.delay}ms`;

        const iconCircle = createEl('div', 'w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center');
        const icon = createEl('div', `icon ${item.iconClass} w-9 h-9 text-white text-blue-600-icon`);
        icon.style.width = '36px'; icon.style.height = '36px';

        iconCircle.appendChild(icon);

        card.appendChild(iconCircle);
        card.appendChild(createEl('h2', 'text-2xl font-bold text-gray-900 mb-4', item.title));
        card.appendChild(createEl('p', 'text-gray-600 leading-relaxed', item.desc));
        mviGrid.appendChild(card);
    });
    mviContainer.appendChild(mviGrid);
    mviSection.appendChild(mviContainer);
    containerDiv.appendChild(mviSection);

    const valuesSection = createEl('section', 'py-16 bg-white');
    const valuesContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const valuesHeader = createEl('div', 'text-center mb-12');
    valuesHeader.appendChild(createEl('h2', 'text-4xl font-bold text-gray-900 mb-4', 'Our Values'));
    valuesHeader.appendChild(createEl('p', 'text-xl text-gray-600 max-w-2xl mx-auto', 'The principles that guide everything we do'));
    valuesContainer.appendChild(valuesHeader);

    const valuesGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-4 gap-8');

    valuesData.forEach((value) => {
        const card = createEl('div', 'bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp');
        card.style.animationDelay = `${value.delay}ms`;

        const iconCircle = createEl('div', 'w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center');
        const icon = createEl('div', `icon ${value.iconClass} w-7 h-7 text-white`);
        icon.classList.add('text-white-icon'); 
        icon.style.width = '28px'; icon.style.height = '28px';

        iconCircle.appendChild(icon);

        card.appendChild(iconCircle);
        card.appendChild(createEl('h4', 'text-xl font-bold text-gray-900 mb-3 text-center', value.title));
        card.appendChild(createEl('p', 'text-gray-600 text-center leading-relaxed', value.desc));
        valuesGrid.appendChild(card);
    });
    valuesContainer.appendChild(valuesGrid);
    valuesSection.appendChild(valuesContainer);
    containerDiv.appendChild(valuesSection);

    const teamSection = createEl('section', 'py-16 bg-gray-50');
    const teamContainer = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const teamHeader = createEl('div', 'text-center mb-12');
    teamHeader.appendChild(createEl('h2', 'text-4xl font-bold text-gray-900 mb-4', 'Meet Our Team'));
    teamHeader.appendChild(createEl('p', 'text-xl text-gray-600', 'The passionate people behind Quick Hire'));
    teamContainer.appendChild(teamHeader);

    const teamGrid = createEl('div', 'grid md:grid-cols-2 lg:grid-cols-4 gap-8');

    teamData.forEach((member) => {
        const card = createEl('div', 'bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn');
        card.style.animationDelay = `${member.delay}ms`;

        const photo = createEl('div', 'w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4');

        card.appendChild(photo);
        card.appendChild(createEl('h3', 'text-xl font-bold text-gray-900 mb-2', member.name));
        card.appendChild(createEl('p', 'text-blue-600 font-semibold', member.role));
        teamGrid.appendChild(card);
    });
    teamContainer.appendChild(teamGrid);
    teamSection.appendChild(teamContainer);
    containerDiv.appendChild(teamSection);

    const contactSection = createEl('section', 'py-20 bg-gradient-to-r from-blue-600 to-blue-500');
    const contactContainer = createEl('div', 'max-w-4xl mx-auto px-4 text-center');
    contactContainer.appendChild(createEl('h2', 'text-4xl font-bold text-white mb-4', 'Contact Us'));
    contactContainer.appendChild(createEl('p', 'text-xl text-blue-100 mb-8', 'Have questions? We\'d love to hear from you'));

    const contactInfoBox = createEl('div', 'bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-8 text-white');
    const contactInfo = createEl('div', 'space-y-4', '', true);
    contactInfo.innerHTML = `
            <p class="text-lg"><strong>Email:</strong> info@quickhire.com</p>
            <p class="text-lg"><strong>Phone:</strong> +91 1234567890</p>
            <p class="text-lg"><strong>Address:</strong> Quick Hire Inc., 123 Career Blvd., Hyderabad, Telangana, India</p>
        `;
    contactInfoBox.appendChild(contactInfo);
    contactContainer.appendChild(contactInfoBox);
    contactSection.appendChild(contactContainer);
    containerDiv.appendChild(contactSection);

    return containerDiv;
}
