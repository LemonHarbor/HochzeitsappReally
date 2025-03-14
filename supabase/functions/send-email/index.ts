import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { emailType, recipient, data } = await req.json();

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate required parameters
    if (!emailType || !recipient || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Send email based on type
    let emailResult;
    switch (emailType) {
      case "rsvp_reminder":
        emailResult = await sendRsvpReminder(recipient, data);
        break;
      case "seating_update":
        emailResult = await sendSeatingUpdate(recipient, data);
        break;
      case "invitation":
        emailResult = await sendInvitation(recipient, data);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid email type" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
    }

    // Log the email sending in the database
    const { error: logError } = await supabase.from("email_logs").insert({
      recipient_email: recipient.email,
      email_type: emailType,
      sent_at: new Date().toISOString(),
      status: emailResult.success ? "sent" : "failed",
      error_message: emailResult.success ? null : emailResult.error,
    });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(JSON.stringify(emailResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: emailResult.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

// Send RSVP reminder email
async function sendRsvpReminder(recipient, data) {
  try {
    // In a production environment, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For this example, we'll simulate sending an email
    console.log(
      `Sending RSVP reminder to ${recipient.email} for ${data.eventName}`,
    );

    // Simulate email sending
    const emailContent = {
      to: recipient.email,
      subject: `RSVP Reminder: ${data.eventName}`,
      body: `
        <h1>RSVP Reminder</h1>
        <p>Hello ${recipient.name},</p>
        <p>This is a friendly reminder to RSVP for ${data.eventName} by ${data.rsvpDeadline}.</p>
        <p>Please click the button below to submit your RSVP:</p>
        <a href="${data.rsvpLink}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:4px;">RSVP Now</a>
        <p>We look forward to celebrating with you!</p>
      `,
    };

    // In a real implementation, you would send the email here
    // await sendEmailWithService(emailContent);

    return { success: true, message: "RSVP reminder sent successfully" };
  } catch (error) {
    console.error("Error sending RSVP reminder:", error);
    return { success: false, error: error.message };
  }
}

// Send seating update notification
async function sendSeatingUpdate(recipient, data) {
  try {
    console.log(
      `Sending seating update to ${recipient.email} for table ${data.tableName}`,
    );

    // Simulate email sending
    const emailContent = {
      to: recipient.email,
      subject: `Your Seating Assignment Has Been Updated`,
      body: `
        <h1>Seating Update</h1>
        <p>Hello ${recipient.name},</p>
        <p>Your seating assignment for ${data.eventName} has been updated.</p>
        <p>You are now seated at <strong>${data.tableName}</strong>, seat ${data.seatNumber}.</p>
        <p>You can view your updated seating arrangement by clicking the button below:</p>
        <a href="${data.viewLink}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:4px;">View Seating</a>
        <p>We look forward to celebrating with you!</p>
      `,
    };

    // In a real implementation, you would send the email here
    // await sendEmailWithService(emailContent);

    return {
      success: true,
      message: "Seating update notification sent successfully",
    };
  } catch (error) {
    console.error("Error sending seating update:", error);
    return { success: false, error: error.message };
  }
}

// Send invitation email
async function sendInvitation(recipient, data) {
  try {
    console.log(
      `Sending invitation to ${recipient.email} for ${data.eventName}`,
    );

    // Simulate email sending
    const emailContent = {
      to: recipient.email,
      subject: `You're Invited to ${data.eventName}!`,
      body: `
        <h1>You're Invited!</h1>
        <p>Hello ${recipient.name},</p>
        <p>We are delighted to invite you to ${data.eventName} on ${data.eventDate} at ${data.eventTime}.</p>
        <p>Location: ${data.eventLocation}</p>
        <p>Please RSVP by ${data.rsvpDeadline} by clicking the button below:</p>
        <a href="${data.rsvpLink}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:4px;">RSVP Now</a>
        <p>We look forward to celebrating with you!</p>
        <p>Access code: ${data.accessCode}</p>
      `,
    };

    // In a real implementation, you would send the email here
    // await sendEmailWithService(emailContent);

    return { success: true, message: "Invitation sent successfully" };
  } catch (error) {
    console.error("Error sending invitation:", error);
    return { success: false, error: error.message };
  }
}
