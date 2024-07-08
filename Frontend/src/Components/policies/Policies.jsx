import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

const PolicySection = ({ title, content }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
    <Typography variant="h5" gutterBottom color="primary">
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="body1">{content}</Typography>
  </Paper>
);

const Policies = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Edugainer Policies
      </Typography>

      <PolicySection
        title="Terms and Conditions"
        content="This privacy policy applies to all Users who access the Edugainer Platform and are therefore required to read and understand the Policy before submitting any Personal Information. By submitting Personal Information, you are consenting to the use and processing of such information in accordance with this Policy. Edugainer does not sell, transfer or rent your personal information to third parties for their marketing purposes without your explicit consent. We view protection of your privacy as a very important principle and store and process your personal information on secure servers located in India."
      />

      <PolicySection
        title="Privacy Policy"
        content="We collect information you provide when you register on our platform, such as your name, age, email address, location, and phone number. We use this information to provide and improve our services, contact you about your account, and send you important notices. We may use cookies to track your preferences and login information. You can customize our usage of your personal information, and you have the right to access, correct, or delete your personal data."
      />

      <PolicySection
        title="Pricing Policy"
        content="Our pricing for library access and classes is clearly displayed on our platform. All prices are in Indian Rupees and are inclusive of all applicable taxes. We reserve the right to change our pricing at any time, but any price changes will not affect services already purchased."
      />

      <PolicySection
        title="No Shipping and No Refund Policy"
        content="Edugainer provides digital services and does not offer physical products, therefore we do not provide shipping services. All purchases made on our platform are final and non-refundable. We encourage users to carefully review the service details before making a purchase."
      />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Contact Us
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          If you have any questions about these policies, you can contact us:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Email color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={
                <Link
                  href="mailto:edugainersclasses@gmail.com"
                  underline="hover"
                  color="inherit"
                >
                  edugainersclasses@gmail.com
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Phone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Phone" secondary="9997999768" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOn color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Address"
              secondary="Edugainer, Uttarkashi, Uttarakhand, India"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Policies;
