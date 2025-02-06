import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import winston from 'winston';

// Initialize logger for admin actions
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'admin-actions.log' }),
  ],
});

// Define the User schema with email, password, and role
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true, // Ensures email is stored in lowercase
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'shipper', 'carrier'], // Restricts user roles
      required: true,
    },
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' fields automatically
);

// Middleware: Hash the password before saving a new user or updating their password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Static method for creating a new user
userSchema.statics.createUser = async function ({ email, password, role }) {
  const user = new this({ email, password, role });
  await user.save();
  return user;
};

// Method to compare hashed passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware: Log admin actions when users are updated or deleted
userSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(`User ${doc.email} was updated by an admin at ${new Date().toISOString()}`);
  }
});

userSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(`User ${doc.email} was deleted by an admin at ${new Date().toISOString()}`);
  }
});

export default mongoose.model('User', userSchema);
