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
          Thanks for signing up on <b>BizLaunch</b>, a modern SaaS starter built and maintained by Thuto Mpshe.
        </p>
        <p>
          This platform is ideal for startups and small teams looking to quickly launch subscription-based web apps.
        </p>
        <p>
          If you'd like to collaborate, contribute, or learn more, visit:
          <a href="https://github.com/ThutoCodes/Full-stack-SaaS-Boilerplate" target="blank">My GitHub</a>.
        </p>
        <p>
          All the best,<br />
          Thuto Mpshe
        </p>
      `,
    },
    {
      name: 'login',
      subject: 'Login link for your BizLaunch account',
      message: `
        <p>Log into your BizLaunch account by clicking on this secure link: <a href="<%= loginURL %>"><%= loginURL %></a>.</p>`,
    },
    {
      name: 'invitation',
      subject: 'You are invited to join a team on BizLaunch',
      message: `You've been invited to join <b><%= teamName %></b> on BizLaunch.
        <br/>Click here to accept your invitation: <%= invitationURL %>
      `,
    },
    {
      name: 'newPost',
      subject: 'New post created in Discussion: <%= discussionName %>',
      message: `<p>New post in "<%= discussionName %>" by <%= authorName %></p>
        <p><%= postContent %></p>
        <p>---</p>
        <p>View and reply at <a href="<%= discussionLink %>"><%= discussionLink %></a>.</p>
      `,
    },
  ];

  for (const t of templates) {
    const et = await EmailTemplate.findOne({ name: t.name }).setOptions({ lean: true });
    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      EmailTemplate.create(Object.assign({}, t, { message }));
    } else if (et.subject !== t.subject || et.message !== message) {
      EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

export default async function getEmailTemplate(name: string, params: any) {
  await insertTemplates();

  const et = await EmailTemplate.findOne({ name }).setOptions({ lean: true });

  if (!et) {
    throw new Error('Email Template not found in database.');
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}