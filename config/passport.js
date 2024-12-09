const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("./models");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Invalid credentials" });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});
