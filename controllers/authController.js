//  authcontroller.js file 
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const generateUserId = require("../utils/userIdGenerator");
async function registerUser(req, res) {

    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            address,
            landmark,
            pincode
        } = req.body;

        // Validation
        if (
            !first_name ||
            !last_name ||
            !email ||
            !phone ||
            !password ||
            !address ||
            !landmark ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const { data: emailExists, error: emailError } = await supabase
            .from("usersdata")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (emailError) throw emailError;

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        const { data: phoneExists, error: phoneError } = await supabase
            .from("usersdata")
            .select("id")
            .eq("phone", phone)
            .maybeSingle();

        if (phoneError) throw phoneError;

        if (phoneExists) {
            return res.status(400).json({
                success: false,
                message: "Phone already registered."
            });
        }

        const user_id = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error } = await supabase
            .from("usersdata")
            .insert([
                {
                    user_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    password: hashedPassword,
                    address,
                    landmark,
                    pincode
                }
            ]);
        logger.success(`New Account Created -> ${user_id}`);
        if (error) throw error;
        return res.status(201).json({
            success: true,
            message: "Account Created Successfully ✅",
            user: { user_id, first_name, last_name, email, phone, address, landmark, pincode }

        });
    } catch (err) {
        logger.error(err.message);
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function getProfile(req, res) {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID required."
            });
        }

        const { data, error } = await supabase
            .from("usersdata")
            .select(`
                user_id,
                first_name,
                last_name,
                email,
                phone,
                address,
                landmark,
                pincode
            `).eq("user_id", user_id).maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        logger.info(`Profile Loaded -> ${user_id}`);
        return res.status(200).json({
            success: true,
            user: data
        });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function updateProfile(req, res) {
    try {
        const {
            user_id,
            first_name,
            last_name,
            email,
            phone,
            address,
            landmark,
            pincode
        } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID required."
            });
        }

        const { data: emailUser, error: emailError } = await supabase.from("usersdata").select("user_id").eq("email", email).maybeSingle();
        if (emailError) throw emailError;

        if (emailUser && emailUser.user_id != user_id) {
            return res.status(400).json({
                success: false,
                message: "Email already in use."
            });
        }
        const { data: phoneUser, error: phoneError } = await supabase.from("usersdata").select("user_id").eq("phone", phone).maybeSingle();

        if (phoneError) throw phoneError;

        if (phoneUser && phoneUser.user_id != user_id) {
            return res.status(400).json({
                success: false,
                message: "Phone already in use."
            });
        }

        const { error } = await supabase
            .from("usersdata")
            .update({
                first_name,
                last_name,
                email,
                phone,
                address,
                landmark,
                pincode
            })
            .eq("user_id", user_id);

        if (error) throw error;
        logger.success(`Profile Updated -> ${user_id}`);
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully ✅"
        });

    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const {
            loginUser,
            password
        } = req.body;

        if (!loginUser || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Phone and Password required."
            });
        }

        let { data: user, error } = await supabase.from("usersdata").select("*").eq("email", loginUser).maybeSingle();

        if (error) throw error;

        if (!user) {
            const result = await supabase.from("usersdata").select("*").eq("phone", loginUser).maybeSingle();
            if (result.error) throw result.error;

            user = result.data;
        }

        if (!user) {
            logger.error(`Account Not Found -> ${loginUser}`);
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            logger.error(`Wrong Password -> ${loginUser}`);
            return res.status(401).json({
                success: false,
                message: "Incorrect Password."
            });
        }

        logger.success(`Login Success -> ${user.user_id}`);
        return res.status(200).json({
            success: true,
            message: "Login Successful ✅",
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                landmark: user.landmark,
                pincode: user.pincode
            }
        });

    } catch (err) {
        logger.error(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function changePassword(req, res) {
    try {
        const {
            user_id,
            currentPassword,
            newPassword
        } = req.body;
        if (!user_id || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const { data: user, error } = await supabase.from("usersdata").select("password").eq("user_id", user_id).maybeSingle();

        if (error) throw error;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Current Password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        const { error: updateError } = await supabase.from("usersdata").update({password: hashedPassword}).eq("user_id", user_id);

        if (updateError) throw updateError;

        logger.success(`Password Changed -> ${user_id}`);
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully ✅"
        });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    registerUser, loginUser, getProfile, updateProfile, changePassword
};