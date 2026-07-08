import { prisma } from '../../../lib/prisma';
import { validateNotice } from '../../../lib/validation';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // Urgent sorts above Normal (see schema comment)
          { publishDate: 'desc' },
        ],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  }

  if (req.method === 'POST') {
    const { title, body, category, priority, publishDate, image } = req.body;

    const { isValid, errors } = validateNotice({ title, body, category, priority, publishDate });
    if (!isValid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category || 'General',
          priority: priority || 'Normal',
          publishDate: publishDate ? new Date(publishDate) : new Date(),
          image: image || null,
        },
      });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}