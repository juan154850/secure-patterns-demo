export const reflectedXssInsecure = (req, res) => {
  const { name } = req.query;
  //Acá se inserta directamente el input del usuario en el HTML sin sanitizar
  const html = `<h1>Hola ${name}</h1>`;
  res.send(html);
};
