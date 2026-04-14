import type { NewsUpdate, Project, CoreProgram, StrategicPriority, DonorProject, Partner } from './types';
import { Briefcase, BookOpen, HandHelping, Leaf, Smile, PiggyBank, Users, Megaphone } from 'lucide-react';

export const featuredProjects: Project[] = [
  {
    id: 'proj1',
    title: 'Cultural Heritage',
    category: 'Culture',
    summary: 'Preserving and promoting iTaukei traditions, crafts, and language for future generations.',
    imageId: 'project-culture',
  },
  {
    id: 'proj2',
    title: 'Educational Assistance',
    category: 'Education',
    summary: 'Providing scholarships and educational resources to empower women and children.',
    imageId: 'project-education',
  },
  {
    id: 'proj3',
    title: 'Economic Empowerment',
    category: 'Economy',
    summary: 'Developing sustainable livelihoods through training in business and traditional skills.',
    imageId: 'project-economy',
  },
];

export const latestNews: NewsUpdate[] = [
  {
    id: 'news1',
    title: 'Education Assistance Deadline approaching',
    date: '15 AUG 2024',
    summary: 'Applications for the 2025 school year scholarship program close on September 30th. Apply now to secure your child\'s future.',
  },
  {
    id: 'news2',
    title: 'New Weaving Project Announced with Women Fund Fiji',
    date: '02 AUG 2024',
    summary: 'A new partnership will provide 50 women with advanced weaving training and market access.',
  },
  {
    id: 'news3',
    title: 'Community Health Screening a Success',
    date: '25 JUL 2024',
    summary: 'Over 200 members of the community received free health checks at the Ra Marama Great Hall last weekend.',
  },
];

export const corePrograms: CoreProgram[] = [
    {
        id: 'cp1',
        title: 'Economic Empowerment',
        description: 'We provide training and resources for women to start and grow small businesses, from traditional handicrafts to modern agriculture. This includes financial literacy workshops, access to micro-loans, and establishing market linkages.',
        icon: PiggyBank
    },
    {
        id: 'cp2',
        title: 'Education Assistance',
        description: 'Our scholarship programs support students from primary to tertiary levels, ensuring that financial hardship does not prevent access to education. We also run tutoring and mentoring programs.',
        icon: BookOpen
    },
    {
        id: 'cp3',
        title: 'Community Outreach',
        description: 'We engage with communities across Cakaudrove to identify needs and deliver targeted support. This includes health and wellness campaigns, leadership training, and cultural preservation workshops.',
        icon: Megaphone
    }
];

export const strategicPriorities: StrategicPriority[] = [
    {
        id: 'sp1',
        title: 'Strengthen Organizational & Governance Structure',
        description: 'Enhancing our internal capacity to effectively serve our members and manage projects with transparency and accountability.'
    },
    {
        id: 'sp2',
        title: 'Improve Health, Well-being and Social Justice',
        description: 'Focusing on initiatives that promote physical and mental health, and advocating for the rights and safety of women and children.'
    },
    {
        id: 'sp3',
        title: 'Protect and Sustain the Environment',
        description: 'Implementing programs for sustainable agriculture, waste management, and the protection of our natural resources.'
    },
    {
        id: 'sp4',
        title: 'Promote the Welfare of Children',
        description: 'Ensuring children have access to education, health, and a safe environment to grow and thrive.'
    },
    {
        id: 'sp5',
        title: 'Strengthen Economic Empowerment for Women',
        description: 'Creating diverse income-generating opportunities to ensure financial independence and resilience for women and their families.'
    }
];

export const donorProjects: DonorProject[] = [
    {
        id: 'dp1',
        title: 'Women\'s Voice and Leadership',
        partner: 'Women Fund Fiji',
        description: 'A multi-year project to increase the participation of women in leadership and decision-making roles at the community and provincial levels.'
    },
    {
        id: 'dp2',
        title: 'GEF Small Grants Programme',
        partner: 'UNDP',
        description: 'Supporting community-based projects that address climate change and promote environmental conservation through sustainable practices.'
    },
    {
        id: 'dp3',
        title: 'Ra Marama Great Hall Design',
        partner: 'Architects Without Frontiers',
        description: 'The initial design and architectural planning for our headquarters was generously provided, enabling a culturally appropriate and functional space.'
    },
    {
        id: 'dp4',
        title: 'Provincial Women\'s Centre Support',
        partner: 'Fijian Government',
        description: 'Ongoing support from the Ministry of Women, Children and Poverty Alleviation to facilitate our core programs and outreach.'
    }
];

export const partners: Partner[] = [
    { id: 'p1', name: 'Architects Without Borders', logoId: 'partner-awb', url: 'https://www.architectswithoutfrontiers.com.au/' },
    { id: 'p2', name: 'Australian Volunteers Program', logoId: 'partner-avp', url: 'https://www.australianvolunteers.com/' },
    { id: 'p3', name: 'Global Environment Facility', logoId: 'partner-gef', url: 'https://www.thegef.org/who-we-are' },
    { id: 'p4', name: 'United Nations Development Programme', logoId: 'partner-undp', url: 'https://www.undp.org/' },
    { id: 'p5', name: 'Small Grants Programme', logoId: 'partner-sgp', url: 'https://sgp.undp.org/index.php' },
    { id: 'p6', name: 'Women Fund Fiji', logoId: 'partner-wff', url: 'https://womensfundfiji.org/' },
    { id: 'p7', name: 'New Zealand Ministry of Foreign Affairs and Trade', logoId: 'partner-mfat', url: 'https://www.mfat.govt.nz/' },
];
