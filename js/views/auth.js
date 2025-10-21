import { createEl } from '../utils.js';
import * as state from '../state.js';

export function renderAuthPageContent(handlers) {
    const { handleLogin, handleRegistration, setAuthMode, setRegisterUserType, handleForgotPassword } = handlers;
    
    const { authMode, loginFormData, registerFormData, registerUserType } = state.authState;
    const container = createEl('div', 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn');
    
    const card = createEl('div', 'max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl');

    card.appendChild(createEl('h2', 'mt-6 text-center text-3xl font-extrabold text-gray-900', 
        authMode === 'login' ? 'Sign in to Quick Hire' : 'Create Your Quick Hire Account'));
    
    if (authMode === 'register') {
        const typeSelector = createEl('div', 'mt-4 flex space-x-4');
        const seekerBtn = createEl('button', `flex-1 py-2 rounded-lg font-semibold transition-all ${registerUserType === 'seeker' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, 'Job Seeker');
        seekerBtn.onclick = () => setRegisterUserType('seeker');
        
        const recruiterBtn = createEl('button', `flex-1 py-2 rounded-lg font-semibold transition-all ${registerUserType === 'recruiter' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, 'Recruiter');
        recruiterBtn.onclick = () => setRegisterUserType('recruiter');
        
        typeSelector.appendChild(seekerBtn);
        typeSelector.appendChild(recruiterBtn);
        card.appendChild(typeSelector);
    }

    const form = createEl('form', 'mt-8 space-y-6');
    
    if (authMode === 'login') {
        form.onsubmit = handleLogin;
        
        form.appendChild(createAuthInput('email', 'Email Address', 'email', loginFormData.email, (e) => state.authState.loginFormData.email = e.target.value, 'icon-mail', true));
        form.appendChild(createAuthInput('password', 'Password', 'password', loginFormData.password, (e) => state.authState.loginFormData.password = e.target.value, 'icon-lock', true));

        const typeSelectWrapper = createEl('div', 'relative mt-4');
        const typeSelect = createEl('select', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none');
        typeSelect.innerHTML = `<option value="seeker">Sign In as Job Seeker</option><option value="recruiter">Sign In as Recruiter</option>`;
        typeSelect.value = loginFormData.type;
        typeSelect.onchange = (e) => state.authState.loginFormData.type = e.target.value;
        typeSelectWrapper.appendChild(createEl('div', 'icon icon-user w-5 h-5 absolute left-3 top-3.5 text-white text-gray-400-icon'));
        typeSelectWrapper.appendChild(typeSelect);
        form.appendChild(typeSelectWrapper);

        const optionsDiv = createEl('div', 'flex items-center justify-between');
        const forgotLink = createEl('button', 'text-sm text-blue-600 hover:text-blue-500', 'Forgot password?');
        forgotLink.type = "button"; // Prevent form submission
        forgotLink.onclick = handleForgotPassword;
        optionsDiv.appendChild(forgotLink);
        form.appendChild(optionsDiv);
        
        const loginButton = createEl('button', 'w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors', 'Sign In');
        loginButton.type = "submit";
        form.appendChild(loginButton);

    } else {
        form.onsubmit = handleRegistration;
        
        form.appendChild(createAuthInput('text', 'Full Name', 'name', registerFormData.name, (e) => state.authState.registerFormData.name = e.target.value, 'icon-user'));

        if (registerUserType === 'recruiter') {
            form.appendChild(createAuthInput('text', 'Company Name', 'companyName', registerFormData.companyName, (e) => state.authState.registerFormData.companyName = e.target.value, 'icon-briefcase'));
        }

        form.appendChild(createAuthInput('email', 'Email Address', 'email', registerFormData.email, (e) => state.authState.registerFormData.email = e.target.value, 'icon-mail'));
        form.appendChild(createAuthInput('password', 'Password', 'password', registerFormData.password, (e) => state.authState.registerFormData.password = e.target.value, 'icon-lock'));

        if (registerUserType === 'seeker') {
            form.appendChild(createAuthInput('text', 'Location', 'location', registerFormData.location, (e) => state.authState.registerFormData.location = e.target.value, 'icon-map-pin'));
            form.appendChild(createAuthInput('text', 'Skills (comma-separated)', 'skills', registerFormData.skills, (e) => state.authState.registerFormData.skills = e.target.value, 'icon-hash'));
        }
        
        const registerButton = createEl('button', 'w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors', 'Register Account');
        registerButton.type = "submit";
        form.appendChild(registerButton);
    }
    
    card.appendChild(form);

    const switchLink = createEl('div', 'text-center text-sm');
    switchLink.innerHTML = authMode === 'login' 
        ? `Don't have an account? <a href="#" class="font-medium text-blue-600 hover:text-blue-500" id="auth-switch-link">Sign Up</a>`
        : `Already have an account? <a href="#" class="font-medium text-blue-600 hover:text-blue-500" id="auth-switch-link">Sign In</a>`;
    
    // Add event listener to the link
    switchLink.querySelector('#auth-switch-link').onclick = (e) => {
        e.preventDefault();
        setAuthMode(authMode === 'login' ? 'register' : 'login');
    };
        
    card.appendChild(switchLink);

    container.appendChild(card);
    return container;
}

function createAuthInput(type, placeholder, name, value, onInput, iconClass, useSmallIcon = false) {
    const inputWrapper = createEl('div', 'relative');
    const iconSizeClass = useSmallIcon ? 'w-5 h-5' : 'w-6 h-6';
    inputWrapper.appendChild(createEl('div', `icon ${iconClass} ${iconSizeClass} absolute left-3 top-3 text-white text-gray-400-icon`));
    
    const input = createEl('input', 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all');
    input.type = type;
    input.name = name;
    input.required = true;
    input.placeholder = placeholder;
    input.value = value;
    input.oninput = onInput;
    
    inputWrapper.appendChild(input);
    return inputWrapper;
}