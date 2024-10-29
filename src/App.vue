<template>
  <main class="container">
    <div class="d-flex">
      <EditToggle @edit-mode-toggled="toggleEditMode" />
      
      <!-- <div>
        <ExportPdf />
      </div> -->
     
    </div>

    <div id="resume" class="d-flex" :class="{'edit-off': !editing}">
      <div class="left-col">
        <ResumeSection>
          <img v-bind:src="imageUrl" class="profile-pic" alt="profile picture">
          <SectionHeadline :headline="headlines[0]" @headline-edited="updateHeadline($event, 0)" :editing="editing" />
          <div 
            :contenteditable="editing" 
            @input="updateProperty($event, 'introText')">
            {{ introText }}
          </div>
        </ResumeSection>

        <ResumeSection>
          <SectionHeadline :headline="headlines[1]" @headline-edited="updateHeadline($event, 1)" :editing="editing" />
          <Contact
            :contact="contact"
            @edit="updateNestedProperty"
            :editing="editing"
          />
        </ResumeSection>

        <ResumeSection>
          <SectionHeadline :headline="headlines[6]" @headline-edited="updateHeadline($event, 6)" :editing="editing" />
          <ul>
            <li 
              v-for="(item, index) in personalProjects" 
              :key="index"
              :contenteditable="editing"
              @input="updateNestedProperty($event, 'personalProjects', index)">
              <a :href="item.projectUrl" target="_blank">{{  item.title  }}</a>
            </li>
          </ul>
          <EditButtons
            @add-click="skills.push('new entry')"
            @remove-click="skills.pop()" />
        </ResumeSection>

        <ResumeSection>
          <SectionHeadline :headline="headlines[2]" @headline-edited="updateHeadline($event, 2)" :editing="editing" />
          <ul>
            <li 
              v-for="(skill, index) in skills" 
              :key="index"
              :contenteditable="editing"
              @input="updateNestedProperty($event, 'skills', index)">
              {{  skill  }}
            </li>
          </ul>
          <EditButtons
            @add-click="skills.push('new entry')"
            @remove-click="skills.pop()" />
        </ResumeSection>

        <ResumeSection>
          <SectionHeadline 
            :headline="headlines[3]" 
            @headline-edited="updateHeadline($event, 3)" 
            :editing="editing" />
          <ul>
            <li
              v-for="(highlight, index) in highlights" 
              :key="index"
              :contenteditable="editing"
              @input="updateNestedProperty($event, 'highlights', index)">
              {{  highlight  }}
            </li>
            <EditButtons
              @add-click="highlights.push('new entry')"
              @remove-click="highlights.pop()" />
          </ul>
        </ResumeSection>
      </div>
      <div class="right-col">
        <div class="personal-name">
          {{ name }}
        </div>
        <div class="personal-title">
          {{ title }}
        </div>
        <ResumeSection>
          <div class="d-flex">
            <SectionHeadline :headline="headlines[4]" @headline-edited="updateHeadline($event, 4)" :editing="editing" />
            <EditButtons :show-remove-btn="false" @add-click="addExperience" />
          </div>
          <div 
            v-for="(item, index) in experience" 
            :key="index" 
            class="inner-section">
            <div class="d-flex justify-content-between">
              <div
                :contenteditable="editing"
                @input="updateExperience($event, 'title', index)">
                {{ item.title }}
              </div>
              <EditButtons @remove-click="removeExperience(index)" :show-add-btn="false" />
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <span
                  :contenteditable="editing" 
                  @input="updateExperience($event, 'company', index)">
                  {{ item.company }}
                </span>, 
                <span
                  :contenteditable="editing" 
                  @input="updateExperience($event, 'location', index)">
                  {{ item.location }}
                </span>
              </div>
              <div 
                :contenteditable="editing"
                @input="updateExperience($event, 'date', index)">
                {{ item.date }}
              </div>
            </div>
            <div class="d-flex justify-content-between tech-stack">
              <div
                :contenteditable="editing"
                @input="updateExperience($event, 'techStack', index)">
                {{ item.techStack }}
              </div>
            </div>
            <ul>
              <li 
                v-for="(desc, innerIndex) in item.description" 
                :key="innerIndex"
                :contenteditable="editing"
                @input="updateExperienceDescription($event, index, innerIndex)">
                {{ desc }}
              </li>
            </ul>
            <EditButtons
              @add-click="item.description.push('new entry')"
              @remove-click="item.description.pop()" 
              :show-remove-btn="item.description.length > 0" />
          </div>
        </ResumeSection>
        <ResumeSection>
          <div class="d-flex">
            <SectionHeadline :headline="headlines[5]" @headline-edited="updateHeadline($event, 5)" :editing="editing" />
            <EditButtons :show-remove-btn="false" @add-click="addEducation" />
          </div>
          <div 
            v-for="(item, index) in education" 
            :key="index" 
            class="inner-section">
            <div class="d-flex justify-content-between">
              <div
                :contenteditable="editing"
                @input="updateEducation($event, 'title', index)">
                {{ item.title }}
              </div>
              <EditButtons @remove-click="removeEducation(index)" :show-add-btn="false" />
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <span
                  :contenteditable="editing" 
                  @input="updateEducation($event, 'school', index)">
                  {{ item.school }}
                </span>, 
                <span
                  :contenteditable="editing" 
                  @input="updateEducation($event, 'location', index)">
                  {{ item.location }}
                </span>
              </div>
              <div 
                :contenteditable="editing"
                @input="updateEducation($event, 'date', index)">
                {{ item.date }}
              </div>
            </div>
          </div>
        </ResumeSection>
      </div>
    </div>
  </main>
</template>

<script>
import ExportPdf from './components/ExportPdf.vue';
import ResumeSection from './components/ResumeSection.vue';
import SectionHeadline from './components/SectionHeadline.vue';
import Contact from './components/Contact.vue';
import EditButtons from './components/EditButtons.vue';
import EditToggle from './components/EditToggle.vue';

export default {
  components: {
    ResumeSection,
    SectionHeadline,
    Contact,
    EditButtons,
    EditToggle,
    ExportPdf
  },
  data() {
    return {
      name: "Ta-Chien (David) Tung",
      title: "Senior Software Engineer",
      introText: "Passionate Senior Software Engineer who has over 10 years of web application development experience. Has strong knowledge of different tools and technologies when it comes to web development, and has many experiences in leading projects with agile development processes",
      imageUrl: "/profile_pic.png",
      skills: ["Python/Django", "PHP/CodeIgniter", "RESTful API", "JavaScript", "React", "AngularJS", "MySQL", "PostgreSQL", "GCP", "AWS", "Kubernets", "Helm", "Terraform", "RabbitMQ", "Redis"],
      personalProjects: [
        {
          title: "dSonic Resume Builder",
          projectUrl: "http://dsonic-resume-builder.davidtung.ca"
        }
      ],
      headlines: ["About me", "Contact", "Skills", "Certifications", "Experience", "Education", "Personal Projects"],
      contact: {
        phone: "604-704-1219",
        email: "dsonic@gmail.com",
        address: "Richmond BC, Canada",
        github: "https://github.com/dsonic0912",
        portfolio: "http://www.davidtung.ca"
      },
      highlights: ["Certified PHP/MySQL Web Developer, University of Illinois - 2012", "Certified Linux System Administrator, University of Illinois - 2008"],
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Citylitics",
          location: "Toronto, Ontario",
          date: "Oct 2021 - Oct 2024",
          techStack: "Django, React, TanStack Query, Ant Design, MySQL, Redis, RabbitMQ, Elasticsearch, Scrapy, GCP, Kubernetes",
          description: [
            "Led a team of 2 junior developers in developing new features and maintaining a platform that provides insights on public infrastructure projects and a search engine for potential projects in North America",
            "Streamlined the code review process with a checklist and small pull requests to ensure the pull requests can be reviewed in one business day",
            "Integrated some static analysis tools such as pre-commit, black, and ESLint into CI/CD pipeline to ensure code consistency and to prevent code quality regressions",
            "Integrated a feature flagging tool (LaunchDarkly) into the development workflow to speed up the deployment cycle from bi-weekly to weekly and to be able to beta test new features on the production server",
            "Migrated the entire front-end codebase to TypeScript to improve code quality and readability",
            "Revamped the whole CI/CD workflow to speed up the deployment process with docker caching by 400%",
            "Led the Crawler data pipeline project with a junior developer in redesigning the whole infrastructure. The data that can be processed has been increased to 4 million from 1 million a month"
          ]
        },
        {
          title: "Senior Backend Developer",
          company: "Procurify",
          location: "Vancouver, BC",
          date: "July 2016 - Aug 2021",
          techStack: "Django, React, AngularJS, MySQL, Redis, AWS, Kubernetes",
          description: [
            "Led a 4-person team, discussed project roadblocks to drive issue resolution, promoting the use of best practices for improving the data import system, the successful rate has been increased by 80%",
            "Designed, developed, and implemented RESTful API with Django Rest Framework to integrate with both Web app and mobile app",
            "Followed TDD development process to write code",
            "Refactored and cleaned up some technical debts to boost the application performance and reduce the load time by as high as 95%",
            "Implemented email deep linking, OCR (Receipt Scanning) system for expense approval process with mobile app download banners to increase the mobile adaption rate by 20%",
            "Upgraded the codebase with 50,000+ lines from Python 2 to Python 3 in one month",
            "Integrated with Stripe Connect API to build a company payment system"
          ]
        },
        {
          title: "Senior Full Stack Developer (Tech Lead)",
          company: "LBSTeck Inc.",
          location: "Taipei City, Taiwan",
          date: "Jun 2014 - Jun 2016",
          techStack: "Django, AngularJS, Bootstrap, MySQL, PostgreSQL, AWS, EC2",
          description: [ 
            "Led a 4-person team in building new features and maintaining a large-scale online dating platform and mobile app with over 50,000 daily active users",
            "Adapted the alige software development process, runing scrums, daily standups",
            "Built a location-based travel mobile app (Fun in Taipei) in Swift for iPhone",
            "Involved in a hiring process for junior and senior developers",
            "Streamlined the onboarding experience for new members to get onboarded as fast as 3 days with a checklist and easy to setup development environment"
          ]
        },
        {
          title: "Web Developer",
          company: "Friend/Finder Networks Inc.",
          location: "Taipei City, Taiwan",
          date: "Jun 2012 - Jun 2014",
          techStack: "PHP, CodeIgniter, CSS, JQuery, MySQL, Perl",
          description: [ 
            "Built and maintained the backend of an online dating site (friendfinder.com) with millions of active users",
            "Built a Facebook-like 3rd party Javascript SDK for canvas game integration with authentication, in-app purchase, and widgets",
            "Led a junior developer in building a social marketing tool application with Facebook, Google+ and Twitter API Integration"
          ]
        }
      ],
      education: [
        {
          title: "Bachelor of Computer Information System (Undergraduate)",
          school: "Douglas College",
          location: "New Westminster, BC",
          date: "2004-2006"
        }
      ],
      editing: false
    };
  },
  methods: {
    updateHeadline(newValue, index) {
      this.headlines[index] = newValue;
    },
    updateProperty(event, key) {
      this[key] = event.target.innerText;
    },
    updateNestedProperty(event, key1, key2) {
      this[key1][key2] = event.target.innerText;
    },
    updateExperience(event, key, index) {
      this.experience[index][key] = event.target.innerText;
    },
    updateExperienceDescription(event, index1, index2) {
      this.experience[index1]['description'][index2] = event.target.innerText;
    },
    addExperience() {
      this.experience.unshift({
        title: "Job Title",
        company: "Company",
        location: "Location",
        date: "Date Range",
        techStack: "Tech Stack",
        description: [
          "description"
        ]
      })
    },
    removeExperience(index) {
      this.experience.splice(index, 1);
    },
    toggleEditMode(isChecked) {
      this.editing = isChecked;
    },
    addEducation() {
      this.education.unshift({
        title: "Title",
        school: "School",
        location: "Location",
        date: "Date Range"
      })
    },
    removeEducation(index) {
      this.education.splice(index, 1);
    }
  }
};
</script>

<style scoped>
  #resume {
    box-shadow: rgb(50, 50, 93, 0.25) 0px 13px 27px -5px, rgb(0, 0, 0, 0.3) 0px 8px 16px -8px;
    height: 590mm;
    width: 210mm;
  }

  .left-col {
    background-color: var(--background-color-left);
    color: var(--text-color-left);
    border-right: 1px solid var(--highlight-color-left);
    width: 30%;
    padding: 30px;
  }

  .right-col {
    background-color: var(--background-color-right);
    color: var(--text-color-right);
    width: 70%;
    padding: 30px;
  }

  .personal-name {
    font-weight: 300;
    color: var(--highlight-color-right);
    font-size: 28px;
    border-bottom: 1px solid var(--highlight-color-right);
    margin: 0;
    margin-left: -30px;
    padding-left: 30px;
    padding-bottom: 15px;
  }

  .personal-title {
    border-bottom: 1px solid var(--highlight-color-right);
    margin: 0 0 20px -30px;
    padding: 15px 0 15px 30px;
    font-weight: 300;
    font-size: 20px;
  }

  #resume ul {
    padding-inline-start: 16px;
    margin-block-end: 5px;
    margin-block-start: 5px;
  }

  .profile-pic {
    display: block;
    width: 160px;
    height: 160px;
    border: 5px solid var(--highlight-color-left);
    margin-bottom: 20px;
    object-fit: cover;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
  }

  .inner-section {
    margin-bottom: 20px;
  }

  .justify-content-between {
    justify-content: space-between;
  }

  .tech-stack {
    margin-top: 20px;
  }
</style>