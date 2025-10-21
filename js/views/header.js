import { createEl } from '../utils.js';
import * as state from '../state.js';
import { storage } from '../storage.js';

export function renderHeader(handlers) {
    const { onNavigate, toggleNotifications, handleLogout } = handlers;
    
    const header = createEl('header', 'bg-white shadow-sm sticky top-0 z-50 animate-slideDown');
    const navContainer = createEl('nav', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    const flexDiv = createEl('div', 'flex justify-between items-center h-16');

    // --- Logo ---
    const logoDiv = createEl('div', 'flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform');
    logoDiv.onclick = () => onNavigate('home');
    logoDiv.appendChild(createEl('div', 'icon icon-briefcase w-7 h-7 text-white text-blue-600-icon'));
    logoDiv.appendChild(createEl('span', 'text-2xl font-bold text-blue-600', 'Quick Hire'));
    flexDiv.appendChild(logoDiv);

    // --- Navigation ---
    const navDiv = createEl('div', 'hidden md:flex space-x-8');
    if (state.authState.isLoggedIn) {
        const navItems = ['home', 'jobs', 'candidate', 'recruiter', 'about'];
        const navLabels = { home: 'Home', jobs: 'Jobs', candidate: 'Dashboard', recruiter: 'Dashboard', about: 'About' };
        const userType = state.authState.currentUser.type;

        navItems.forEach(page => {
            if ((page === 'candidate' && userType === 'recruiter') || (page === 'recruiter' && userType === 'seeker')) return;

            const isActive = state.currentPage === page;
            const buttonClass = `transition-colors font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`;
            const button = createEl('button', buttonClass, navLabels[page]);
            button.onclick = () => onNavigate(page);
            navDiv.appendChild(button);
        });
    }
    flexDiv.appendChild(navDiv);

    // --- Right Side (Notifications, User, Logout/Login) ---
    const rightSide = createEl('div', 'flex items-center space-x-4');

    if (state.authState.isLoggedIn) {
        rightSide.appendChild(createEl('span', 'hidden sm:inline text-sm font-semibold text-gray-700', `Hi, ${state.authState.currentUser.name.split(' ')[0]}`));

        // Notifications
        const userNotifications = storage.getNotifications().filter(n => n.recipientEmail === state.authState.currentUser.email);
        const notificationWrapper = createEl('div', 'relative');
        const bellButton = createEl('button', 'p-2 hover:bg-gray-100 rounded-full transition-colors relative');
        bellButton.onclick = toggleNotifications;
        bellButton.appendChild(createEl('div', 'icon icon-bell w-[22px] h-[22px] text-white text-gray-600-icon'));

        if (userNotifications.length > 0) {
            bellButton.appendChild(createEl('span', 'absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse'));
        }

        notificationWrapper.appendChild(bellButton);

        if (state.showNotifications) {
            const notifDropdown = createEl('div', 'absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border animate-fadeIn');

            // Header + Clear All
            const headerFlex = createEl('div', 'flex justify-between items-center p-4 border-b');
            headerFlex.appendChild(createEl('h3', 'font-semibold', 'Notifications'));

            const clearBtn = createEl('button', 'text-xs text-blue-600 hover:underline', 'Clear All');
            clearBtn.onclick = () => {
                storage.clearNotifications(state.authState.currentUser.email);
                toggleNotifications(); // Close and re-render
            };
            headerFlex.appendChild(clearBtn);
            notifDropdown.appendChild(headerFlex);

            // Content
            const notifContent = createEl('div', 'p-4 max-h-80 overflow-y-auto');
            const spaceY = createEl('div', 'space-y-2');

            if (userNotifications.length === 0) {
                spaceY.appendChild(createEl('p', 'text-gray-500 text-sm text-center py-4', 'No new notifications.'));
            } else {
                userNotifications.forEach(notif => {
                    const notifCard = createEl('div', `relative p-3 pr-8 rounded-lg text-sm ${notif.type === 'success' ? 'bg-green-50' : 'bg-blue-50'}`);

                    notifCard.appendChild(createEl('p', `font-medium ${notif.type === 'success' ? 'text-green-800' : 'text-blue-800'}`, notif.type === 'success' ? 'Success!' : 'Update'));
                    notifCard.appendChild(createEl('p', 'text-gray-600', notif.message));

                    // "×" clear button
                    const clearOneBtn = createEl('button', 'absolute top-1/2 right-2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors');
                    clearOneBtn.innerHTML = '&#215;';
                    Object.assign(clearOneBtn.style, {
                        fontSize: '1.25rem',
                        lineHeight: '1',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });
                    clearOneBtn.title = "Clear this notification";
                    clearOneBtn.onclick = (e) => {
                        e.stopPropagation();
                        storage.clearNotificationById(notif.id);
                        toggleNotifications(); // Close and re-render
                    };

                    notifCard.appendChild(clearOneBtn);
                    spaceY.appendChild(notifCard);
                });
            }

            notifContent.appendChild(spaceY);
            notifDropdown.appendChild(notifContent);
            notificationWrapper.appendChild(notifDropdown);
        }

        rightSide.appendChild(notificationWrapper);

        // Logout
        const logoutBtn = createEl('button', 'px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors', 'Logout');
        logoutBtn.onclick = handleLogout;
        rightSide.appendChild(logoutBtn);
    } else {
        const loginBtn = createEl('button', 'px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors', 'Sign In');
        loginBtn.onclick = () => onNavigate('login');
        rightSide.appendChild(loginBtn);
    }

    flexDiv.appendChild(rightSide);
    navContainer.appendChild(flexDiv);
    header.appendChild(navContainer);
    return header;
}