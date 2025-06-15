import escapeHtml from 'escape-html';

export const reflectedXssSecure = (req, res) => {
  const { name } = req.query;
  //Acá nos ayudamos de la libreria para escapar el input del usuario y así evitar ejecución de HTML
  const sanitized = escapeHtml(name);
  const html = `<h1>Hola ${sanitized}</h1>`;
  res.send(html);
};
