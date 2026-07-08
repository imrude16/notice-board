import { CATEGORIES, PRIORITIES } from './constants';

export function validateNotice(data) {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.body || typeof data.body !== 'string' || !data.body.trim()) {
    errors.body = 'Body is required';
  }

  if (data.category && !CATEGORIES.includes(data.category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(', ')}`;
  }

  if (data.priority && !PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
  }

  if (data.publishDate) {
    const d = new Date(data.publishDate);
    if (isNaN(d.getTime())) {
      errors.publishDate = 'publishDate must be a valid date';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}