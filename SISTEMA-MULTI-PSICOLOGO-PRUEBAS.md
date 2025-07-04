# 🧠 Multi-Psychologist System: Complete Testing Guide

## **🎯 What We Have Implemented**

### ✅ **Complete Multi-Psychologist System:**
1. **Psychologist Entity** with separate calendars
2. **Appointments by psychologist** with total privacy  
3. **Individual Google Calendar** for each psychologist
4. **Automatic Google Meet** per psychologist
5. **Personalized emails** with psychologist information
6. **Specific queries** per psychologist

---

## **🔧 Initial Configuration**

### **Step 1: Create Calendars in Google Calendar**

For each psychologist you need:

1. **Create individual calendar** in Google Calendar:
   - Go to Google Calendar → "+" → "Create new calendar"
   - Name: "Dr. Juanito Appointments", "Dr. Paz Appointments", etc.
   - Description: "Psychological appointments calendar"

2. **Share with Service Account**:
   - Go to Settings → "Share with specific people"
   - Add: `your-service-account@psico-consultas.iam.gserviceaccount.com`
   - Permissions: "Make changes to events"

3. **Get Calendar ID**:
   - Go to Calendar Settings → "Integrate calendar"
   - Copy "Calendar ID": something like `abc123@group.calendar.google.com`

### **Step 2: Restart Server**
```bash
yarn start:dev
```

---

## **🧪 Step-by-Step Tests**

### **🔹 Step 1: Create Psychologists**

#### **Create Dr. Juanito:**
```graphql
mutation {
  createPsychologist(createPsychologistInput: {
    firstName: "Juan Carlos"
    lastName: "García López"
    email: "juanito@clinic.com"
    phone: "+56912345678"
    specialty: "Clinical Psychology"
    description: "Specialist in cognitive-behavioral therapy with 10 years of experience"
    googleCalendarId: "JUANITO_CALENDAR_ID@group.calendar.google.com"
    calendarColor: "#4285F4"
  }) {
    id
    firstName
    lastName
    email
    specialty
    googleCalendarId
    active
  }
}
```

#### **Create Dr. Paz:**
```graphql
mutation {
  createPsychologist(createPsychologistInput: {
    firstName: "María Paz"
    lastName: "Rodríguez Silva"
    email: "paz@clinic.com"
    phone: "+56987654321"
    specialty: "Child Psychology"
    description: "Specialist in child and adolescent therapy with systemic approach"
    googleCalendarId: "PAZ_CALENDAR_ID@group.calendar.google.com"
    calendarColor: "#DB4437"
  }) {
    id
    firstName
    lastName
    email
    specialty
    googleCalendarId
    active
  }
}
```

#### **Create Dr. Carlos:**
```graphql
mutation {
  createPsychologist(createPsychologistInput: {
    firstName: "Carlos"
    lastName: "Mendoza Torres"
    email: "carlos@clinic.com"
    phone: "+56945678901"
    specialty: "Couples Psychology"
    description: "Specialist in couples and family therapy with humanistic approach"
    googleCalendarId: "CARLOS_CALENDAR_ID@group.calendar.google.com"
    calendarColor: "#0F9D58"
  }) {
    id
    firstName
    lastName
    email
    specialty
    googleCalendarId
    active
  }
}
```

### **🔹 Step 2: Verify Created Psychologists**

```graphql
query {
  psychologists {
    id
    firstName
    lastName
    email
    specialty
    googleCalendarId
    active
    appointments {
      id
      date
      time
      type
      reason
    }
  }
}
```

**Expected result:**
```json
{
  "data": {
    "psychologists": [
      {
        "id": "uuid-juanito",
        "firstName": "Juan Carlos",
        "lastName": "García López",
        "email": "juanito@clinic.com",
        "specialty": "Clinical Psychology",
        "googleCalendarId": "juanito-calendar-id@group.calendar.google.com",
        "active": true,
        "appointments": []
      },
      // ... other psychologists
    ]
  }
}
```

### **🔹 Step 3: Create Test User**

```graphql
mutation {
  createUser(createUserInput: {
    rut: "12.345.678-9"
    firstName: "Ana"
    lastName: "Martínez González"
    email: "your-personal-email@gmail.com"  # 👈 Your email to receive tests
    phone: "+56923456789"
    address: "Av. Providencia 123, Santiago"
  }) {
    id
    firstName
    lastName
    email
    rut
  }
}
```

### **🔹 Step 4: Test Appointments by Psychologist**

#### **IN-PERSON Appointment with Dr. Juanito:**
```graphql
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-25"
    time: "10:00"
    type: IN_PERSON
    reason: "Initial evaluation - Anxiety and work stress"
    userId: "USER_ID_HERE"
    psychologistId: "JUANITO_ID_HERE"
  }) {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      id
      firstName
      lastName
      email
    }
    psychologist {
      id
      firstName
      lastName
      email
      specialty
    }
  }
}
```

#### **ONLINE Appointment with Dr. Paz:**
```graphql
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-26"
    time: "14:00"
    type: ONLINE
    reason: "Child therapy session - Behavioral issues"
    userId: "USER_ID_HERE"
    psychologistId: "PAZ_ID_HERE"
  }) {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      id
      firstName
      lastName
      email
    }
    psychologist {
      id
      firstName
      lastName
      email
      specialty
    }
  }
}
```

#### **IN-PERSON Appointment with Dr. Carlos:**
```graphql
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-27"
    time: "16:00"
    type: IN_PERSON
    reason: "Couples therapy session - Communication problems"
    userId: "USER_ID_HERE"
    psychologistId: "CARLOS_ID_HERE"
  }) {
    id
    date
    time
    type
    reason
    googleEventId
    googleMeetLink
    user {
      id
      firstName
      lastName
      email
    }
    psychologist {
      id
      firstName
      lastName
      email
      specialty
    }
  }
}
```

### **🔹 Step 5: Verify Appointments by Psychologist**

#### **Get Dr. Juanito's Appointments:**
```graphql
query {
  psychologist(id: "JUANITO_ID_HERE") {
    id
    firstName
    lastName
    email
    specialty
    appointments {
      id
      date
      time
      type
      reason
      confirmed
      cancelled
      googleEventId
      googleMeetLink
      user {
        firstName
        lastName
        email
      }
    }
  }
}
```

#### **Get Dr. Paz's Appointments:**
```graphql
query {
  psychologist(id: "PAZ_ID_HERE") {
    id
    firstName
    lastName
    email
    specialty
    appointments {
      id
      date
      time
      type
      reason
      confirmed
      cancelled
      googleEventId
      googleMeetLink
      user {
        firstName
        lastName
        email
      }
    }
  }
}
```

### **🔹 Step 6: Test Privacy Between Psychologists**

#### **Get All Appointments (Global View):**
```graphql
query {
  appointments {
    id
    date
    time
    type
    reason
    user {
      firstName
      lastName
      email
    }
    psychologist {
      firstName
      lastName
      email
      specialty
    }
  }
}
```

**Expected result shows ALL appointments from ALL psychologists:**
```json
{
  "data": {
    "appointments": [
      {
        "id": "appointment-juanito-1",
        "date": "2024-12-25T00:00:00.000Z",
        "time": "10:00",
        "type": "IN_PERSON",
        "reason": "Initial evaluation - Anxiety and work stress",
        "user": {
          "firstName": "Ana",
          "lastName": "Martínez González",
          "email": "your-personal-email@gmail.com"
        },
        "psychologist": {
          "firstName": "Juan Carlos",
          "lastName": "García López",
          "email": "juanito@clinic.com",
          "specialty": "Clinical Psychology"
        }
      },
      {
        "id": "appointment-paz-1",
        "date": "2024-12-26T00:00:00.000Z",
        "time": "14:00",
        "type": "ONLINE",
        "reason": "Child therapy session - Behavioral issues",
        "user": {
          "firstName": "Ana",
          "lastName": "Martínez González",
          "email": "your-personal-email@gmail.com"
        },
        "psychologist": {
          "firstName": "María Paz",
          "lastName": "Rodríguez Silva",
          "email": "paz@clinic.com",
          "specialty": "Child Psychology"
        }
      },
      {
        "id": "appointment-carlos-1",
        "date": "2024-12-27T00:00:00.000Z",
        "time": "16:00",
        "type": "IN_PERSON",
        "reason": "Couples therapy session - Communication problems",
        "user": {
          "firstName": "Ana",
          "lastName": "Martínez González",
          "email": "your-personal-email@gmail.com"
        },
        "psychologist": {
          "firstName": "Carlos",
          "lastName": "Mendoza Torres",
          "email": "carlos@clinic.com",
          "specialty": "Couples Psychology"
        }
      }
    ]
  }
}
```

---

## **🔹 Step 7: Test Google Calendar Integration**

### **Check Individual Calendars:**

1. **Dr. Juanito's Calendar:**
   - Should show: 1 event (IN-PERSON appointment)
   - Event Title: "Psychological Appointment"
   - No Google Meet link

2. **Dr. Paz's Calendar:**
   - Should show: 1 event (ONLINE appointment)
   - Event Title: "Psychological Appointment (Online)"
   - WITH Google Meet link

3. **Dr. Carlos's Calendar:**
   - Should show: 1 event (IN-PERSON appointment)
   - Event Title: "Psychological Appointment"
   - No Google Meet link

### **Verify Calendar Separation:**
- Each psychologist should ONLY see their own events
- No cross-contamination between calendars
- Each calendar has its own color scheme

---

## **🔹 Step 8: Test Email Functionality**

### **Check Email Inbox:**

You should receive **3 different emails**, each with:

1. **Email from Dr. Juanito (IN-PERSON):**
   - Subject: "✅ Psychological Appointment Confirmation - Wednesday, December 25, 2024"
   - Psychologist: "Juan Carlos García López"
   - Specialty: "Clinical Psychology"
   - Email: "juanito@clinic.com"
   - **NO Google Meet section**

2. **Email from Dr. Paz (ONLINE):**
   - Subject: "✅ Psychological Appointment Confirmation - Thursday, December 26, 2024"
   - Psychologist: "María Paz Rodríguez Silva"
   - Specialty: "Child Psychology"
   - Email: "paz@clinic.com"
   - **WITH Google Meet section and button**

3. **Email from Dr. Carlos (IN-PERSON):**
   - Subject: "✅ Psychological Appointment Confirmation - Friday, December 27, 2024"
   - Psychologist: "Carlos Mendoza Torres"
   - Specialty: "Couples Psychology"
   - Email: "carlos@clinic.com"
   - **NO Google Meet section**

---

## **🔹 Step 9: Advanced Multi-Psychologist Tests**

### **Test 1: Multiple Appointments Same Day, Different Psychologists**

```graphql
# Same day, different psychologists
mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-28"
    time: "09:00"
    type: ONLINE
    reason: "Morning session with Dr. Juanito"
    userId: "USER_ID_HERE"
    psychologistId: "JUANITO_ID_HERE"
  }) { id }
}

mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-28"
    time: "14:00"
    type: IN_PERSON
    reason: "Afternoon session with Dr. Paz"
    userId: "USER_ID_HERE"
    psychologistId: "PAZ_ID_HERE"
  }) { id }
}

mutation {
  createAppointment(createAppointmentInput: {
    date: "2024-12-28"
    time: "16:00"
    type: ONLINE
    reason: "Evening session with Dr. Carlos"
    userId: "USER_ID_HERE"
    psychologistId: "CARLOS_ID_HERE"
  }) { id }
}
```

### **Test 2: Get Appointments by Date Range**

```graphql
query {
  upcomingAppointments {
    id
    date
    time
    type
    reason
    user {
      firstName
      lastName
    }
    psychologist {
      firstName
      lastName
      specialty
    }
  }
}
```

### **Test 3: Get Appointments by User**

```graphql
query {
  appointmentsByUser(userId: "USER_ID_HERE") {
    id
    date
    time
    type
    reason
    psychologist {
      firstName
      lastName
      specialty
      email
    }
  }
}
```

### **Test 4: Update Appointment (Transfer Between Psychologists)**

```graphql
mutation {
  updateAppointment(
    id: "APPOINTMENT_ID_HERE"
    updateAppointmentInput: {
      psychologistId: "NEW_PSYCHOLOGIST_ID_HERE"
      reason: "Transferred to specialist"
    }
  ) {
    id
    date
    time
    type
    reason
    psychologist {
      firstName
      lastName
      specialty
    }
  }
}
```

---

## **🔹 Expected Success Indicators**

### **✅ Database Verification:**
- Each psychologist has their own records
- Appointments are properly linked to specific psychologists
- Calendar IDs are unique per psychologist
- No data mixing between psychologists

### **✅ Google Calendar Verification:**
- Each psychologist has their own calendar
- Events appear in correct calendars
- No cross-contamination between calendars
- Meet links generated only for ONLINE appointments

### **✅ Email Verification:**
- Each email contains correct psychologist information
- Email signatures match the assigned psychologist
- Meet links only appear for ONLINE appointments
- Specialist information is correctly displayed

### **✅ Privacy Verification:**
- Psychologist-specific queries work correctly
- Global queries show all appointments (admin view)
- No unauthorized access to other psychologists' data

---

## **🔹 Troubleshooting Multi-Psychologist Issues**

### **Problem: Events appearing in wrong calendar**
- Check `googleCalendarId` in psychologist record
- Verify calendar sharing permissions
- Ensure calendar IDs are unique
- Check service account permissions

### **Problem: Wrong psychologist in emails**
- Verify appointment → psychologist relationship
- Check email template psychologist data
- Ensure proper entity loading with relations

### **Problem: Google Meet not generating for specific psychologist**
- Check psychologist's calendar permissions
- Verify Google Calendar API quota
- Check if psychologist's calendar supports Meet
- Review service account calendar access

### **Problem: Mixed appointments between psychologists**
- Check database foreign key relationships
- Verify GraphQL resolver logic
- Ensure proper entity mapping
- Check appointment creation logic

---

## **🔹 Production Considerations**

### **Security:**
- Each psychologist should only access their own data
- Implement authentication per psychologist
- Add role-based access control
- Audit appointment access logs

### **Scalability:**
- Consider pagination for large appointment lists
- Implement efficient database queries
- Add caching for frequently accessed data
- Monitor API rate limits per psychologist

### **Backup & Recovery:**
- Backup individual psychologist data
- Implement data export per psychologist
- Plan for calendar recovery procedures
- Test appointment restoration processes

This comprehensive test ensures the multi-psychologist system works correctly with proper data isolation, individual calendars, and personalized communications. 