const verifyJWT = require("./verifyJWT");

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    verifyJWT(req, res, () => {
      console.log(`user roles: ${req.roles}`);
      if (!req?.roles) return res.sendStatus(401);
      const rolesArray = [...allowedRoles];
      const result = req.roles
        .map((role) => rolesArray.includes(role))
        .includes(true);
      if (!result) return res.sendStatus(401);
      next();
    });
  };
};

module.exports = verifyRoles;
