import * as state from './state.js'; // Needs state for statusColors/Icons

/** Helper to create an element with class and text content */
export function createEl(tag, className, textContent = '', innerHTML = false) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) {
        el.innerHTML = textContent;
    } else if (textContent) {
        el.textContent = textContent;
    }
    return el;
}

/** Creates the status icon element for application cards */
export function createStatusTag(status) {
    const className = state.statusColors[status];
    const iconClass = state.statusIcons[status];
    const StatusIcon = createEl('div', `icon ${iconClass} w-[14px] h-[14px] mr-1`);

    if (status === 'Pending') StatusIcon.classList.add('text-yellow-800-icon');
    if (status === 'Shortlisted') StatusIcon.classList.add('text-blue-800-icon');
    if (status === 'Hired') StatusIcon.classList.add('text-green-800-icon');
    if (status === 'Rejected') StatusIcon.classList.add('text-red-800-icon');

    const span = createEl('span', `px-3 py-1 rounded-full text-xs font-semibold flex items-center ${className}`);
    span.appendChild(StatusIcon);
    span.appendChild(document.createTextNode(status));
    return span;
}