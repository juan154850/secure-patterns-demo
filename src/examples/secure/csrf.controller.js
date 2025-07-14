let userEmail = 'original@example.com';

export const getCsrfToken = (req, res) => {
  // Exponemos el token CSRF para ser usado en peticiones POST seguras
  res.json({ csrfToken: req.csrfToken() });
};

export const updateEmailSecure = (req, res) => {
  const { email } = req.body;
  userEmail = email;
  res.json({ message: 'Email actualizado (seguro)', email: userEmail });
};
