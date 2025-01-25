/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 
// Save scroll position before the page is unloaded

window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});


window.addEventListener('DOMContentLoaded', () => {


    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// Function to load and parse the YAML file
async function loadYAML() {
    const response = await fetch('https://raw.githubusercontent.com/ahmedhozny/ahmedhozny/main/assets/data.yaml'); // Path to the YAML file
    const yamlText = await response.text();
    return jsyaml.load(yamlText);
}

// Function to render the content on the page
async function renderContent(data) {
    // Set name from YAML
    if (data.name) {
        document.getElementById('name').textContent = data.name;
        const space_idx = data.name.indexOf(" ")
        document.getElementById("first-name").textContent = data.name.substring(0, space_idx)
        document.getElementById("last-name").textContent = data.name.substring(space_idx)
    }

    if (data["resume-link"]) {
        const resumeContainer = document.getElementById('resume-download');
        const resumeLinkElement = document.createElement('a');
        resumeLinkElement.href = data["resume-link"];
        resumeLinkElement.target = '_blank';
        resumeLinkElement.textContent = "View / Download Resume";
        resumeContainer.appendChild(resumeLinkElement);

    }

    // Update location and phone numbers in order
    const locationContainer = document.getElementById('location-container');
    const phoneContainer = document.getElementById('phones');

    data.addresses.forEach((address, index) => {
        let icon = '';
        let locationText = '';

        // Determine the icon based on living or home status
        if (address.living) {
            icon = '<span class="me-2"><i class="fa-solid fa-location-dot"></i></span>';
            locationText = `${address.city} . ${address.country}`;
        } else if (address.home) {
            icon = '<span class="mx-4 me-2"><i class="fa-solid fa-house-chimney"></i></span>';
            locationText = `${address.city} . ${address.country}`;
        }

        // Add the location information to the container
        if (icon && locationText) {
            locationContainer.innerHTML += icon + locationText + ' ';
        }

        // Retrieve and display phone numbers based on dialing code from the address
        const dialingCode = address['dialing-code'];
        const phoneNumbers = data.contacts['phone-numbers'][dialingCode] || [];
        phoneNumbers.forEach((phone, i) => {
            if (phone.display) {
                if (index > 0 || i > 0) {
                    phoneContainer.appendChild(document.createTextNode(" - "));
                }
                const phoneLink = document.createElement('a');
                phoneLink.href = `tel:${phone.link}`;
                phoneLink.textContent = phone.text;
                phoneContainer.appendChild(phoneLink);
            }
        });
    });

    // Update emails
    const emailsContainer = document.getElementById('emails');
    data.contacts['email-addresses'].forEach(emailObj => {
        if (emailObj.display) {
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:${emailObj.email}`;
            emailLink.textContent = emailObj.email;
            emailsContainer.appendChild(emailLink);
        }
    });

    // Set bio from YAML
    if (data.bio) {
        document.getElementById('bio').textContent = data.bio;
    }

    const socialIconsContainer = document.getElementById('social-media-icons');
    Object.keys(data.contacts['social-media']).forEach(platform => {
        const social = data.contacts['social-media'][platform];
        if (social.display) {
            const socialLink = document.createElement('a');
            socialLink.className = 'social-icon';
            socialLink.href = social.url;
            socialLink.target = '_blank';
            const icon = document.createElement('i');
            icon.className = `fab ${social['icon-fa']}`;
            socialLink.appendChild(icon);
            socialIconsContainer.appendChild(socialLink);
        }
    });

    // Render education if they exist
    if (data.education) {
        renderEducation(data.education);
    }

    if (data.experience) {
        renderExperience(data.experience);
    }

    // Render projects if they exist
    if (data.projects) {
        renderProjects(data.projects);
    }

    if (data.skills) {
        renderSkills(data.skills)
    }

    if (data.certifications) {
        renderCertifications(data.certifications)
    }
}

// Function to render the education section
async function renderEducation(education) {
    const educationList = document.getElementById('education-list');
    education.forEach(edu => {
        // Create the HTML structure for each education entry
        const eduElement = document.createElement('div');
        eduElement.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-5');

        let summaryHTML = '';
        if (edu.summary) {
            summaryHTML = edu.summary.map(line => `<div>${line}</div>`).join('');
        }

        eduElement.innerHTML = `
            <div class="flex-grow-1">
                <h3 class="mb-0">${edu.institution}</h3>
                <div class="subheading mb-3">${edu.degree}</div>
                ${summaryHTML}
            </div>
            <div class="flex-shrink-0"><span class="text-primary">${formatDate(edu['start-date'])} - ${formatDate(edu['end-date'])}</span></div>
        `;

        educationList.appendChild(eduElement);
    });
}

async function renderExperience(experiences) {
    const experienceList = document.getElementById('experience-list');
    experiences.forEach(exp => {
        // Create a div for each project entry
        const projectElement = document.createElement('div');
        projectElement.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-5');

        let summaryHTML = '';
        if (exp.summary) {
            summaryHTML = exp.summary.map(line => `<p>${line}</p>`).join('');
        }

        // Build the project element with title, subtitle, summary, and links
        projectElement.innerHTML = `
            <div class="flex-grow-1">
                <h3 class="mb-0">${exp.title}</h3>
                <div class="subheading mb-3">${exp.company}</div>
                ${summaryHTML}
            </div>
            <div class="flex-shrink-0"><span class="text-primary">${formatDate(exp['start-date'], true)} - ${formatDate(exp['end-date'] ?? "Present", false)}</span></div>
        `;

        // Append the project to the list
        experienceList.appendChild(projectElement);
    })
}

// Function to render the projects section
async function renderProjects(projects) {
    const projectListElement = document.getElementById('project-list');
    projects.forEach(project => {
        // Create a div for each project entry
        const projectElement = document.createElement('div');
        projectElement.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-5');

        let summaryHTML = '';
        if (project.summary) {
            summaryHTML = project.summary.map(line => `<p>${line}</p>`).join('');
        }

        // Safely check for links and build the links section
        let linksHTML = '';
        if (project.links) {
            if (project.links.github) {
                linksHTML += `<p>Project on <a href="${project.links.github}" target="_blank">GitHub</a></p>`;
            }
            if (project.links.vercel) {
                linksHTML += `<p>Live at <a href="${project.links.vercel}" target="_blank">Vercel</a></p>`;
            }
        }

        // Build the project element with title, subtitle, summary, and links
        projectElement.innerHTML = `
            <div class="flex-grow-1">
                <h3 class="mb-0">${project.title}</h3>
                <div class="subheading mb-3">${project.subtitle}</div>
                ${summaryHTML}
                ${linksHTML}
            </div>
            <div class="flex-shrink-0"><span class="text-primary">${formatDate(project['start-date'], true)} - ${formatDate(project['end-date'] ?? "Present", false)}</span></div>
        `;

        // Append the project to the list
        projectListElement.appendChild(projectElement);
    });
}


// Function to render the skills section
async function renderSkills(skills) {
    // Render the 'Programming Languages & Tools' section
    const programmingIconsContainer = document.getElementById("programming-icons");

    skills.languages.forEach(lang => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-inline-item');
        liElement.innerHTML = `<img class="icon" src="${lang.icon}" alt="${lang.name}" title="${lang.name}"/>`;
        programmingIconsContainer.appendChild(liElement);
        programmingIconsContainer.innerHTML += "&nbsp;"
    });

    const databaseIconsContainer = document.getElementById("database-icons");

    skills.databases.forEach(app => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-inline-item');
        liElement.innerHTML = `<img class="icon" src="${app.icon}" alt="${app.name}" title="${app.name}"/>`;
        databaseIconsContainer.appendChild(liElement);
        databaseIconsContainer.innerHTML += "&nbsp;"
    });

    const toolsIconsContainer = document.getElementById("tools-icons");

    skills.tools.forEach(tool => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-inline-item');
        liElement.innerHTML = `<img class="icon" src="${tool.icon}" alt="${tool.name}" title="${tool.name}"/>`;
        toolsIconsContainer.appendChild(liElement);
        toolsIconsContainer.innerHTML += "&nbsp;"
    });

    // Render the 'Workflow' section
    const workflowList = document.getElementById("workflow-list");

    skills.workflow.forEach(workflowItem => {
        const liElement = document.createElement('li');
        liElement.innerHTML = `<span class="fa-li"><i class="fas fa-check"></i></span> ${workflowItem}`;
        workflowList.appendChild(liElement);
    });
}

// Function to render the certifications section
async function renderCertifications(certifications) {
    const certificationsContainer = document.getElementById("certifications-list");

    certifications.forEach(cert => {
        const liElement = document.createElement('li');
        liElement.innerHTML = `<span class="fa-li"><i class="fas fa-trophy text-warning"></i></span> ${cert}`;
        certificationsContainer.appendChild(liElement);
    })
}

// Helper function to format dates
function formatDate(date, is_start) {
    if (date === undefined || date === "Present") {
        return "Present"
    }

    const options = { year: 'numeric', month: 'long' };
    const givenDate = new Date(date);
    const currentDate = new Date();

    // Check if the given date is in the future
    if (!is_start && givenDate > currentDate) {
        return "Present";
    }

    return givenDate.toLocaleDateString(undefined, options);
}

// Load YAML data and render content
loadYAML().then((data) => {
    renderContent(data);
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
    }

});
