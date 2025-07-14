import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import express from 'express';

export const csrfProtection = csurf({ cookie: true });

export const setupCsrf = (app) => {
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
};
