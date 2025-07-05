import _ from 'lodash';
import mongoose from 'mongoose';

interface EmailTemplateDocument extends mongoose.Document {
  name: string;
  subject: string;
  message: string;
}

const EmailTemplate = mongoose.model<EmailTemplateDocument>(
  'EmailTemplate',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  }),
);

export async function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to BizLaunch 🎉',
      message: `Welcome <%= userName %>,
        <p>
          Thanks for signing up to explore our SaaS starter platform, BizLaunch.
        </p>
        <p>
          If you're interested in how we built this from scratch, reach out to 
          <a href="https://github.com/ThutoCodes" target="blank">Thuto Mpshe</a>.
        </p>
        <p>
          This project serves as a functional foundation for launching your own SaaS idea.
        </p>
        – Thuto Mpshe
      `,
    },
    {
      name: 'login',
      subject: 'Login link for BizLaunch',
      message: `
        <p>Log into your account by clicking this link: <a href="<%= loginURL %>"><%= loginURL %></a>.</p>`,
    },
    {
      name: 'invitation',
      subject: 'You’ve been invited to join a team on BizLaunch',
      message: `You've been invited to join <b><%= teamName %></b>.
        <br/>Click here to accept: <%= invitationURL %>
      `,
    },
    {
      name: 'newPost',
      subject: 'New Post in Discussion: <%= discussionName %>',
      message: `<p>New Post in "<%= discussionName %>" by <%= authorName %></p>
        <p>Post: "<%= postContent %>"</p>
        <p>View it at <a href="<%= discussionLink %>"><%= discussionLink %></a>.</p>
      `,
    },
  ];

  for (const t of templates) {
    const et = await EmailTemplate.findOne({ name: t.name }).setOptions({ lean: true });
    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      EmailTemplate.create({ ...t, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

export default async function getEmailTemplate(name: string, params: any) {
  await insertTemplates();

  const et = await EmailTemplate.findOne({ name }).setOptions({ lean: true });

  if (!et) {
    throw new Error('Email Template not found in the database.');
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}