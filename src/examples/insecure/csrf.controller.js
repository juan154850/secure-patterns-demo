let userEmail = 'original@example.com';

export const updateEmailInsecure = (req, res) => {
  const { email } = req.body;
  // Acá no se valida el origen ni CSRF token
  userEmail = email;
  res.json({ message: 'Email actualizado (inseguro)', email: userEmail });
};
