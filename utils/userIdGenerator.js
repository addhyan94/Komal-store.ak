//  userldGenerator.js file 

const supabase = require("../config/supabase");

async function generateUserId() {

    const { data, error } = await supabase
        .from("settingsdata")
        .select("*")
        .eq("key", "last_user_id")
        .single();

    if (error) {
        throw error;
    }

    const newUserId = data.value + 1;

    const { error: updateError } = await supabase
        .from("settingsdata")
        .update({
            value: newUserId
        })
        .eq("key", "last_user_id");

    if (updateError) {
        throw updateError;
    }

    return newUserId;

}

module.exports = generateUserId;