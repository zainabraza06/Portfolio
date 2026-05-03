import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';

// Register standard fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #ccc',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 9,
    color: '#555',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#0056b3',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#111',
    textTransform: 'uppercase',
    borderBottom: '1 solid #eee',
    paddingBottom: 4,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#222',
  },
  itemSubtitle: {
    fontSize: 9,
    fontWeight: 600,
    color: '#555',
  },
  itemDate: {
    fontSize: 9,
    color: '#666',
  },
  itemDescription: {
    fontSize: 9,
    color: '#444',
    marginTop: 3,
    textAlign: 'justify',
  },
  techStack: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  skillGroup: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillCategory: {
    width: '25%',
    fontWeight: 700,
    fontSize: 9,
    color: '#333',
  },
  skillList: {
    width: '75%',
    fontSize: 9,
    color: '#444',
  }
});

interface Experience {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  type: 'work' | 'education';
}

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
}

interface SkillGroup {
  category: string;
  skills: string[];
}

interface DynamicCVProps {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary: string;
  };
  experiences: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  certificates?: Certificate[];
}

export const DynamicCV = ({ personalInfo, experiences, projects, skills, certificates = [] }: DynamicCVProps) => {
  const workExp = experiences.filter(e => e.type === 'work');
  const eduExp = experiences.filter(e => e.type === 'education');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.linkedin && (
              <Link style={styles.link} src={personalInfo.linkedin}>LinkedIn</Link>
            )}
            {personalInfo.github && (
              <Link style={styles.link} src={personalInfo.github}>GitHub</Link>
            )}
            {personalInfo.portfolio && (
              <Link style={styles.link} src={personalInfo.portfolio}>Portfolio</Link>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.itemDescription}>{personalInfo.summary}</Text>
        </View>

        {/* Experience Section */}
        {workExp.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExp.map(exp => (
              <View key={exp._id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  </View>
                  <Text style={styles.itemDate}>{exp.duration}</Text>
                </View>
                <Text style={styles.itemDescription}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {eduExp.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {eduExp.map(exp => (
              <View key={exp._id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{exp.company}</Text>
                    <Text style={styles.itemSubtitle}>{exp.role}</Text>
                  </View>
                  <Text style={styles.itemDate}>{exp.duration}</Text>
                </View>
                {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map(proj => (
              <View key={proj._id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.itemTitle}>{proj.title}</Text>
                    {proj.githubUrl && <Link style={styles.link} src={proj.githubUrl}>[GitHub]</Link>}
                    {proj.liveUrl && <Link style={styles.link} src={proj.liveUrl}>[Live]</Link>}
                  </View>
                </View>
                <Text style={styles.techStack}>Technologies: {proj.techStack.join(', ')}</Text>
                <Text style={styles.itemDescription}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications Section */}
        {certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certificates.map((cert, idx) => (
              <View key={cert._id || idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{cert.title}</Text>
                    <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                  </View>
                  <Text style={styles.itemDate}>{cert.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {skills.map(skillGroup => (
              <View key={skillGroup.category} style={styles.skillGroup}>
                <Text style={styles.skillCategory}>{skillGroup.category}:</Text>
                <Text style={styles.skillList}>{skillGroup.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
