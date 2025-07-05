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
          Thanks for signing up to explore our open-source SaaS starter platform, <strong>BizLaunch</strong>!
        </p>
        <p>
          If you're looking to build and launch your own SaaS product, explore the source code at 
          <a href="https://github.com/ThutoCodes/Full-stack-SaaS-Boilerplate" target="blank">Thuto's GitHub</a>.
        </p>
        <p>
          BizLaunch is a clean foundation for scalable web apps — built by <strong>Thuto Mpshe</strong>.
        </p>
        – Thuto, Creator of BizLaunch
      `,
    },
    {
      name: 'login',
      subject: 'Your BizLaunch login link',
      message: `
        <p>Log into your BizLaunch account by clicking on this link: <a href="<%= loginURL %>"><%= loginURL %></a>.</p>`,
    },
    {
      name: 'invitation',
      subject: 'You are invited to join a team on BizLaunch',
      message: `You've been invited to join <b><%= teamName %></b> on BizLaunch.
        <br/>Click here to accept the invitation: <%= invitationURL %>
      `,
    },
    {
      name: 'newPost',
      subject: 'New post in: <%= discussionName %>',
      message: `<p>New post in discussion "<%= discussionName %>" by <%= authorName %></p>
        <p>Post content: "<%= postContent %>"</p>
        <p>---</p>
        <p>View it at <a href="<%= discussionLink %>"><%= discussionLink %></a>.</p>
      `,
    },
  ];

  for (const t of templates) {
    const et = await EmailTemplate.findOne({ name: t.name }).setOptions({ lean: true });
    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      await EmailTemplate.create({ ...t, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      await EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

export default async function getEmailTemplate(name: string, params: any) {
  await insertTemplates();

  const et = await EmailTemplate.findOne({ name }).setOptions({ lean: true });

  if (!et) {
    throw new Error('Email template not found in the database.');
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}