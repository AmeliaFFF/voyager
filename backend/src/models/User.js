const mongoose = require("mongoose");
const crypto = require("node:crypto");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            // Not required because it is automatically generated.
            required: false,
            default: () => {
                return crypto.randomBytes(64).toString("hex");
            }
        }
    },
    {
        timestamps: true
    }
);

// Pre-save hook to hash the password before saving the user document.
// This runs automatically whenever a user is created or updated.
userSchema.pre("save", function () {
    // Ensure the user has a salt. If not, generate one.
    if (!this.salt) {
        this.salt = crypto.randomBytes(64).toString("hex");
    }

    // If the password has not changed, do not hash it again.
    if (!this.isModified("passwordHash")) return;

    // Hash the password using scrypt and the user's salt.
    this.passwordHash = crypto
        .scryptSync(this.passwordHash, this.salt, 64)
        .toString("hex");
});

// Method to compare an incoming password with the stored password hash.
userSchema.methods.comparePassword = function (incomingPasswordToCheck) {
    // Hash the incoming password using the stored salt.
    const hashedIncomingPassword = crypto
        .scryptSync(incomingPasswordToCheck, this.salt, 64)
        .toString("hex");

    // Return true if the hashes match, otherwise return false.
    return this.passwordHash === hashedIncomingPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};