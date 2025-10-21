import { createEl } from '../utils.js';

export function renderFooter(handlers) {
    const { onNavigate } = handlers;
    
    const footer = createEl('footer', 'bg-blue-900 text-white');
    const container = createEl('div', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12');
    
    const grid = createEl('div', 'grid md:grid-cols-4 gap-8');
    
    // Company Info
    const companyDiv = createEl('div', 'md:col-span-2');
    const logoFlex = createEl('div', 'flex items-center space-x-2 mb-4');
    logoFlex.appendChild(createEl('div', 'icon icon-briefcase w-7 h-7 text-white text-blue-500-icon'));
    logoFlex.appendChild(createEl('span', 'text-2xl font-bold text-white', 'Quick Hire'));
    companyDiv.appendChild(logoFlex);
    companyDiv.appendChild(createEl('p', 'text-gray-300 mb-4 max-w-md', 'Connecting talent with opportunity efficiently. We\'re revolutionizing the hiring process with cutting-edge technology and personalized matching.'));
    
    const socialFlex = createEl('div', 'flex space-x-4');
    ['icon-users-large', 'icon-mail'].forEach(iconClass => {
        const link = createEl('a', 'text-gray-400 hover:text-white transition-colors');
        link.href = '#';
        const icon = createEl('div', `icon ${iconClass} w-6 h-6 text-white`);
        // Ensure the icons use the white color
        icon.classList.add('text-white-icon');
        link.appendChild(icon);
        socialFlex.appendChild(link);
    });
    companyDiv.appendChild(socialFlex);
    grid.appendChild(companyDiv);
    
    // Quick Links
    const linksDiv = createEl('div');
    linksDiv.appendChild(createEl('h3', 'text-lg font-semibold mb-4', 'Quick Links'));
    const linksList = createEl('ul', 'space-y-2');
    const linkItems = [
        { text: 'Home', onClick: () => onNavigate('home') },
        { text: 'Find Jobs', onClick: () => onNavigate('jobs') },
        { text: 'About Us', onClick: () => onNavigate('about') },
        { text: 'Privacy Policy', href: '#' },
        { text: 'Terms of Service', href: '#' }
    ];
    
    linkItems.forEach(item => {
        const li = createEl('li');
        if (item.onClick) {
            const button = createEl('button', 'text-gray-300 hover:text-white transition-colors', item.text);
            button.onclick = item.onClick;
            li.appendChild(button);
        } else {
            const link = createEl('a', 'text-gray-300 hover:text-white transition-colors', item.text);
            link.href = item.href;
            li.appendChild(link);
        }
        linksList.appendChild(li);
    });
    linksDiv.appendChild(linksList);
    grid.appendChild(linksDiv);
    
    // Contact Info
    const contactDiv = createEl('div');
    contactDiv.appendChild(createEl('h3', 'text-lg font-semibold mb-4', 'Contact Us'));
    const contactList = createEl('ul', 'space-y-2 text-gray-300');
    
    const contactItems = [
        { icon: 'icon-mail', text: 'info@quickhire.com' },
        { icon: 'icon-briefcase', text: '+91 1234567890' },
        { icon: 'icon-map-pin', text: 'Quick Hire Inc., 123 Career Blvd., Hyderabad, Telangana, India' }
    ];
    
    contactItems.forEach(item => {
        const li = createEl('li', 'flex items-start');
        li.appendChild(createEl('div', `icon ${item.icon} w-4 h-4 mr-2 mt-1 text-white`));
        li.appendChild(createEl('span', 'flex-1', item.text));
        contactList.appendChild(li);
    });
    contactDiv.appendChild(contactList);
    grid.appendChild(contactDiv);
    
    container.appendChild(grid);
    
    // Bottom Bar
    const bottomBar = createEl('div', 'border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center');
    bottomBar.appendChild(createEl('p', 'text-gray-400 text-sm mb-4 md:mb-0', '© 2025 Quick Hire. All rights reserved.'));
    
    const bottomLinks = createEl('div', 'flex space-x-6 text-sm text-gray-400');
    ['Privacy', 'Terms', 'Cookies'].forEach(linkText => {
        const link = createEl('a', 'hover:text-white transition-colors', linkText);
        link.href = '#';
        bottomLinks.appendChild(link);
    });
    bottomBar.appendChild(bottomLinks);
    
    container.appendChild(bottomBar);
    footer.appendChild(container);
    
    return footer;
}