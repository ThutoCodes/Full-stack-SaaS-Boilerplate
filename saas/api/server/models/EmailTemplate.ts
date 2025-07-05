import * as _ from 'lodash';
import * as mongoose from 'mongoose';

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
      subject: 'Welcome to BizLaunch by Thuto Mpshe',
      message: `Welcome <%= userName %>,
        <p>
          Thank you for signing up for <strong>BizLaunch</strong> — a modern SaaS starter platform for small teams and startups.
        </p>
        <p>
          BizLaunch is designed to help developers and founders quickly build subscription-based products with built-in authentication, team collaboration, payments, and more.
        </p>
        <p>
          Feel free to explore the project and reach out if you'd like to collaborate: 
          <a href="https://github.com/ThutoCodes/Full-stack-SaaS-Boilerplate" target="_blank">View on GitHub</a>.
        </p>
        <p>
          All the best,<br />
          <strong>Thuto Mpshe</strong>
        </p>
      `,
    },
    {
      name: 'login',
      subject: 'Login link for your BizLaunch account',
      message: `
        <p>You can log into your BizLaunch account by clicking the secure link below:</p>
        <p><a href="<%= loginURL %>"><%= loginURL %></a></p>`,
    },
    {
      name: 'invitation',
      subject: 'You have been invited to join a team on BizLaunch',
      message: `You've been invited to join the team <strong><%= teamName %></strong> on BizLaunch.
        <br/>To accept the invitation, click here: <%= invitationURL %>
      `,
    },
    {
      name: 'newPost',
      subject: 'New post in discussion: <%= discussionName %>',
      message: `<p>There's a new post in the discussion "<%= discussionName %>" by <%= authorName %>.</p>
        <blockquote><%= postContent %></blockquote>
        <p>View and reply at: <a href="<%= discussionLink %>"><%= discussionLink %></a>.</p>
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
    throw new Error('Email Template is not found in the database.');
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}
