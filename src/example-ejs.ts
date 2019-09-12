import ejs from 'ejs';

export function renderTemplate(path: string, data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const params = {
      date: data.date || '',
      talks: data.talks || []
    };
    ejs.renderFile(path, params, {}, (error, html) => {
      if (error) {
        reject(error);
      } else {
        resolve(html);
      }
    });
  });
}
