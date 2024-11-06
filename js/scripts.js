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


window.addEventListener('DOMContentLoaded', event => {


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

    // Update location
    const locationContainer = document.getElementById('location-container');
    data.addresses.forEach(address => {
        let icon = '';
        let locationText = '';

        if (address.living) {
            icon = '<span class="me-2"><i class="fa-solid fa-location-dot"></i></span>';
            locationText = `${address.city} . ${address.country}`;
        } else if (address.home) {
            icon = '<span class="mx-4 me-2"><i class="fa-solid fa-house-chimney"></i></span>';
            locationText = `${address.city} . ${address.country}`;
        }

        if (icon && locationText) {
            locationContainer.innerHTML += icon + locationText + ' ';
        }
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

    // Update phone numbers
    const phoneContainer = document.getElementById('phones');
    let flag = false
    Object.keys(data.contacts['phone-numbers']).forEach(dialingCode => {
        data.contacts['phone-numbers'][dialingCode].forEach(phone => {
            if (phone.display) {
                if (flag) {
                    phoneContainer.appendChild(document.createTextNode(" - "));
                }
                const phoneLink = document.createElement('a');
                phoneLink.href = `tel:00${phone.link}`;
                phoneLink.textContent = phone.text;
                phoneContainer.appendChild(phoneLink);
                flag = true
            }
        });
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

        // Build the project element with title, subtitle, summary, and links
        projectElement.innerHTML = `
            <div class="flex-grow-1">
                <h3 class="mb-0">${project.title}</h3>
                <div class="subheading mb-3">${project.subtitle}</div>
                ${summaryHTML}
                <p>Project on <a href="${project.links.github}" target="_blank">GitHub</a></p>
                ${project.links.vercel ? `<p>Live at <a href="${project.links.vercel}" target="_blank">Vercel</a></p>` : ''}
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
