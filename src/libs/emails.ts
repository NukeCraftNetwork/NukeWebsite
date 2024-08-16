export function registrationCodeEmail(
  email: string,
  code: string,
  type: string
) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: `Your ${
      type === "forgot" ? "Password Reset" : "Registration"
    } Verification Code 🔑`,
    templateId: 3,
    messageVersions: [
      {
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
        params: {
          code,
          title:
            type === "forgot"
              ? "Your new password"
              : "Thank you for subscribing",
          description:
            type === "forgot"
              ? "Use this code to reset your password. Closing the window before finishing the procedure will require you to start from scratch."
              : "Use this code to continue the registration process. Closing the window before finishing the procedure will require you to start from scratch.",
        },
      },
    ],
  };
}

export function subscriptionCompletedEmail(email: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Subscription Completed ✅",
    templateId: 4,
    messageVersions: [
      {
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
      },
    ],
  };
}

export function userApprovedEmail(email: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Welcome Onboard 🤝",
    templateId: 6,
    messageVersions: [
      {
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
      },
    ],
  };
}

export function opportunityInterestedEmail(
  email: string,
  opportunity: string,
  value: string
) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "We received your interest 😉",
    templateId: 8,
    messageVersions: [
      {
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
        params: {
          opportunity,
          value,
        },
      },
    ],
  };
}

export function vehiculeReadyEmail(email: string, vehicule: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Vehicule Ready 🤝",
    templateId: 9,
    messageVersions: [
      {
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
        params: {
          vehicule,
        },
      },
    ],
  };
}

export function investmentStep1Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 1️⃣ - Verify!",
    templateId: 37,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}

export function investmentStep2Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 2️⃣ - Read The TermSheet!",
    templateId: 38,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}

export function investmentStep3Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 3️⃣ - Sign The Contract!",
    templateId: 39,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}

export function investmentStep4Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 4️⃣ - Download Bank Info & Sign!",
    templateId: 40,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}

export function investmentStep5Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 5️⃣ - We're waiting for your payment!",
    templateId: 41,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}

export function investmentStep6Email(email: string, opportunityTitle: string) {
  return {
    sender: {
      email: process.env.BREVO_EMAIL_FROM,
      name: "Valeureux",
    },
    subject: "Step 6️⃣ - Payment Confirmed!",
    templateId: 42,
    messageVersions: [
      {
        to: [
          {
            email: email,
            name: email.split("@")[0],
          },
        ],
        params: {
          link: `https://valeureux.bysproject.co.uk/opportunities/${opportunityTitle}`,
        },
      },
    ],
  };
}
