# BizLaunch

**BizLaunch** is a modern SaaS starter platform designed for small teams and startups. It includes all essential features to kickstart a subscription-based product, including user authentication, team management, payments, file uploads, and more.

This project served as a learning platform and a functional foundation for building scalable SaaS applications. It’s built using a robust tech stack, including Next.js, Express, MongoDB, Stripe, AWS, and TypeScript.

---

## 🔧 Features

- 🔐 Google OAuth and passwordless login  
- 🧑‍🤝‍🧑 Team creation, member invitation, and access roles  
- 💳 Stripe integration for subscriptions and billing  
- 📁 File uploads with AWS S3  
- ✉️ Email notifications with AWS SES  
- 📊 Dashboard with user and team settings  
- 🌐 Server-side rendering (SSR) for better SEO and speed  
- 🔌 Modular and scalable architecture using REST APIs  

---

## 🧠 My Role & Contribution

I customized and extended the base architecture to simulate a real-world SaaS product. My key contributions include:

- Built and styled the user/team settings dashboard  
- Set up and configured authentication with both OAuth and passwordless login  
- Integrated Stripe for payment subscriptions and webhook events  
- Connected file upload system to AWS S3 with proper CORS configuration  
- Cleaned and secured `.env` usage to prepare for production deployment  

---

## 💡 Tech Stack

- **Frontend:** Next.js, React, Material-UI, TypeScript  
- **Backend:** Node.js, Express, MongoDB, Stripe API, AWS (S3, SES)  
- **Auth:** Google OAuth, Passwordless tokens  
- **Deployment:** AWS Elastic Beanstalk & Lambda compatible  

---

🛡 License
This project is open source under the MIT License.

📬 Contact
If you'd like to collaborate, hire, or discuss this project, feel free to reach out:

GitHub: https://github.com/ThutoCodes

LinkedIn: linkedin.com/in/thuto-thabang-mpshe-361917293

---

## 🚀 Setup (Local Development)

### 1. API
```
cd api
yarn install
yarn dev

Frontend App
cd app
yarn install
yarn dev


