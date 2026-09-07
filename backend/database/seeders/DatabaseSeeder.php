<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Stage;
use App\Models\Interviewer;
use App\Models\Project;
use App\Models\Requisition;
use App\Models\Job;
use App\Models\Candidate;
use App\Models\Application;
use App\Models\Interview;
use App\Models\Task;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Stages (Demo user dihapus - hanya dipakai di localhost frontend)
        $stages = [
            ['id' => 'applied', 'name' => 'Applied', 'color' => '#64748b', 'order' => 1],
            ['id' => 'screening', 'name' => 'Screening', 'color' => '#3b82f6', 'order' => 2],
            ['id' => 'assessment', 'name' => 'Assessment', 'color' => '#8b5cf6', 'order' => 3],
            ['id' => 'interview', 'name' => 'Interview', 'color' => '#eab308', 'order' => 4],
            ['id' => 'offer', 'name' => 'Offer', 'color' => '#f97316', 'order' => 5],
            ['id' => 'hired', 'name' => 'Hired', 'color' => '#22c55e', 'order' => 6],
        ];
        foreach ($stages as $s) {
            Stage::updateOrCreate(['id' => $s['id']], $s);
        }

        // 3. Interviewers
        $interviewers = [
            ['id' => 'int01', 'name' => 'Alex Greene', 'role' => 'Hiring Manager'],
            ['id' => 'int02', 'name' => 'Brenda Smith', 'role' => 'Senior Engineer'],
            ['id' => 'int03', 'name' => 'Charles Brown', 'role' => 'Lead Engineer'],
            ['id' => 'int04', 'name' => 'Diana Prince', 'role' => 'HR Specialist'],
            ['id' => 'int05', 'name' => 'Edward King', 'role' => 'Product Manager'],
            ['id' => 'int06', 'name' => 'Fiona Glenanne', 'role' => 'Recruiter'],
        ];
        foreach ($interviewers as $i) {
            Interviewer::updateOrCreate(['id' => $i['id']], $i);
        }

        // 4. Projects
        $projects = [
            ['id' => 'proj01', 'name' => 'Q3 Engineering Expansion', 'description' => 'Hiring push for senior engineers to build out new microservices architecture.', 'status' => 'Active', 'owner_id' => 'int01', 'created_date' => '2024-07-10T10:00:00Z'],
            ['id' => 'proj02', 'name' => 'Core Product Team Growth', 'description' => 'Expanding the core product and design teams to accelerate feature development.', 'status' => 'Active', 'owner_id' => 'int05', 'created_date' => '2024-07-28T14:00:00Z'],
            ['id' => 'proj03', 'name' => 'New Market Entry (Surabaya)', 'description' => 'Building a foundational team for our new office and operations in Surabaya.', 'status' => 'On Hold', 'owner_id' => 'int01', 'created_date' => '2024-06-15T09:00:00Z'],
        ];
        foreach ($projects as $p) {
            Project::updateOrCreate(['id' => $p['id']], $p);
        }

        // 5. Requisitions
        $requisitions = [
            ['id' => 'req01', 'title' => 'Senior Backend Engineer', 'department' => 'Technology', 'location' => 'Jakarta, Indonesia', 'employment_type' => 'Full-time', 'headcount' => 1, 'experience_level' => 'Senior', 'salary_min' => 100000, 'salary_max' => 140000, 'deadline' => '2024-09-30', 'status' => 'Approved', 'job_id' => 'fsd01'],
            ['id' => 'req02', 'title' => 'UI/UX Designer', 'department' => 'Design', 'location' => 'Remote', 'employment_type' => 'Contract', 'headcount' => 1, 'experience_level' => 'Mid-level', 'salary_min' => 70000, 'salary_max' => 95000, 'deadline' => '2024-08-31', 'status' => 'Approved', 'job_id' => 'ux01'],
            ['id' => 'req03', 'title' => 'Product Manager', 'department' => 'Product', 'location' => 'Remote', 'employment_type' => 'Full-time', 'headcount' => 1, 'experience_level' => 'Senior', 'salary_min' => 110000, 'salary_max' => 150000, 'deadline' => '2024-10-15', 'status' => 'Approved', 'job_id' => 'pm01'],
            ['id' => 'req04', 'title' => 'Sales Development Representative', 'department' => 'Sales', 'location' => 'Surabaya, Indonesia', 'employment_type' => 'Full-time', 'headcount' => 2, 'experience_level' => 'Entry-level', 'salary_min' => 40000, 'salary_max' => 55000, 'deadline' => '2024-09-20', 'status' => 'Pending', 'job_id' => null],
            ['id' => 'req05', 'title' => 'Data Analyst Intern', 'department' => 'Analytics', 'location' => 'Bandung, Indonesia (Hybrid)', 'employment_type' => 'Internship', 'headcount' => 1, 'experience_level' => 'Intern', 'salary_min' => 15000, 'salary_max' => 20000, 'deadline' => '2024-08-25', 'status' => 'Rejected', 'job_id' => null],
            ['id' => 'req06', 'title' => 'DevOps Engineer', 'department' => 'Technology', 'location' => 'Jakarta, Indonesia (Hybrid)', 'employment_type' => 'Full-time', 'headcount' => 1, 'experience_level' => 'Mid-level', 'salary_min' => 95000, 'salary_max' => 125000, 'deadline' => '2024-10-10', 'status' => 'Approved', 'job_id' => null],
        ];
        foreach ($requisitions as $r) {
            Requisition::updateOrCreate(['id' => $r['id']], $r);
        }

        // 6. Job Postings
        $jobs = [
            [
                'id' => 'fsd01',
                'title' => 'Full-Stack Developer',
                'department' => 'Technology',
                'level' => 'Senior',
                'location' => 'Remote',
                'status' => 'Open',
                'employment_type' => 'Full-time',
                'total_applicants' => 4,
                'days_open' => 21,
                'salary_min' => 90000,
                'salary_max' => 130000,
                'deadline' => '2026-09-15',
                'project_id' => 'proj01',
                'job_description' => 'We are looking for a seasoned Full-Stack Developer to build out and manage our web infrastructure. You will be responsible for both front-end and back-end development.',
                'competencies' => ['React', 'Node.js', 'TypeScript', 'SQL', 'System Design', 'CI/CD', 'Communication', 'Problem-Solving'],
                'interview_questions' => [
                    ['type' => 'Behavioral', 'questions' => ['Describe a complex project you led.', 'How do you handle tight deadlines?']],
                    ['type' => 'Technical', 'questions' => ['Explain the difference between SQL and NoSQL databases.', 'Design a simple REST API for a blog.']]
                ],
            ],
            [
                'id' => 'css01',
                'title' => 'Customer Support Specialist',
                'department' => 'Operations',
                'level' => 'Mid-level',
                'location' => 'Surabaya, Indonesia',
                'status' => 'Open',
                'employment_type' => 'Full-time',
                'total_applicants' => 2,
                'days_open' => 12,
                'salary_min' => 45000,
                'salary_max' => 60000,
                'deadline' => '2026-09-30',
                'project_id' => 'proj03',
                'job_description' => 'We are seeking a Customer Support Specialist to join our growing operations team in Surabaya.',
                'competencies' => ['Empathy', 'Communication', 'Problem-Solving', 'Zendesk', 'Ticketing Systems'],
            ],
            [
                'id' => 'dm01',
                'title' => 'Digital Marketing Manager',
                'department' => 'Marketing',
                'level' => 'Senior',
                'location' => 'Remote',
                'status' => 'Open',
                'employment_type' => 'Full-time',
                'total_applicants' => 3,
                'days_open' => 18,
                'salary_min' => 85000,
                'salary_max' => 115000,
                'deadline' => '2026-09-25',
                'project_id' => 'proj02',
                'job_description' => 'Lead our digital marketing campaigns across SEO, SEM, social media, and paid growth channels.',
                'competencies' => ['SEO', 'SEM', 'Google Ads', 'Content Strategy', 'Data Analytics'],
            ],
            [
                'id' => 'ux01',
                'title' => 'UI/UX Designer',
                'department' => 'Design',
                'level' => 'Mid-level',
                'location' => 'Remote',
                'status' => 'Open',
                'employment_type' => 'Contract',
                'total_applicants' => 3,
                'days_open' => 15,
                'salary_min' => 70000,
                'salary_max' => 95000,
                'deadline' => '2026-08-31',
                'project_id' => 'proj02',
                'job_description' => 'Shape the user experience and design systems of our cloud ATS product.',
                'competencies' => ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
            ],
            [
                'id' => 'pm01',
                'title' => 'Product Manager',
                'department' => 'Product',
                'level' => 'Senior',
                'location' => 'Remote',
                'status' => 'Open',
                'employment_type' => 'Full-time',
                'total_applicants' => 2,
                'days_open' => 8,
                'salary_min' => 110000,
                'salary_max' => 150000,
                'deadline' => '2026-10-15',
                'project_id' => 'proj02',
                'job_description' => 'Define product strategy, roadmap, and drive feature execution.',
                'competencies' => ['Product Roadmap', 'Agile Methodologies', 'User Stories', 'Market Research'],
            ]
        ];
        foreach ($jobs as $j) {
            Job::updateOrCreate(['id' => $j['id']], $j);
        }

        // 7. Candidates
        $candidates = [
            [
                'id' => 'cand01',
                'name' => 'Anya Forger',
                'avatar_url' => 'https://picsum.photos/seed/anya/100',
                'email' => 'anya.f@example.com',
                'phone' => '+1234567890',
                'experience_years' => 5,
                'expected_salary' => 120000,
                'skills' => 'React, Node.js, TypeScript, GraphQL, Docker, PostgreSQL',
                'portfolio_url' => 'https://github.com/anyaforger',
                'cv_url' => 'https://res.cloudinary.com/mtyg5nyq/raw/upload/sample_cv_anya.pdf',
                'major' => 'Computer Science',
                'strengths' => 'Fast learner, passionate about frontend architectures.',
            ],
            [
                'id' => 'cand02',
                'name' => 'Loid Forger',
                'avatar_url' => 'https://picsum.photos/seed/loid/100',
                'email' => 'loid.f@example.com',
                'phone' => '+1234567891',
                'experience_years' => 8,
                'expected_salary' => 135000,
                'skills' => 'Go, Python, Kubernetes, Microservices, AWS, System Architecture',
                'portfolio_url' => 'https://github.com/twilight',
                'cv_url' => 'https://res.cloudinary.com/mtyg5nyq/raw/upload/sample_cv_loid.pdf',
                'major' => 'Software Engineering',
                'strengths' => 'Exceptional system architecture and leadership.',
            ],
            [
                'id' => 'cand06',
                'name' => 'Becky Blackbell',
                'avatar_url' => 'https://picsum.photos/seed/becky/100',
                'email' => 'becky.b@example.com',
                'phone' => '+123456789',
                'experience_years' => 6,
                'expected_salary' => 105000,
                'skills' => 'Figma, Sketch, Adobe XD, User Research, Prototyping, Design Systems',
                'portfolio_url' => 'https://dribbble.com/becky',
                'major' => 'Human-Computer Interaction',
            ],
            [
                'id' => 'cand16',
                'name' => 'Maya Sari',
                'avatar_url' => 'https://picsum.photos/seed/maya/100',
                'email' => 'maya.s@example.com',
                'phone' => '+6281234574',
                'experience_years' => 6,
                'expected_salary' => 100000,
                'portfolio_url' => 'https://dribbble.com/mayasari',
                'skills' => 'User Research, Usability Testing, Wireframing, Journey Mapping',
                'major' => 'Psychology',
            ]
        ];
        foreach ($candidates as $c) {
            Candidate::updateOrCreate(['id' => $c['id']], $c);
        }

        // 8. Applications
        $applications = [
            [
                'id' => 'app01',
                'candidate_id' => 'cand01',
                'job_id' => 'fsd01',
                'stage_id' => 'interview',
                'applied_date' => '2026-07-15T10:00:00Z',
                'source' => 'LinkedIn',
                'total_score' => 88,
                'scorecard' => [
                    ['name' => 'Experience Match', 'weight' => 0.4, 'score' => 90],
                    ['name' => 'Technical Skills', 'weight' => 0.4, 'score' => 85],
                    ['name' => 'Cultural Fit', 'weight' => 0.2, 'score' => 90],
                ],
                'notes' => [
                    ['author' => 'Diana Prince', 'content' => 'Strong initial screening call. Candidate seems very knowledgeable about React.', 'date' => '2026-07-16T10:00:00Z'],
                    ['author' => 'Alex Greene', 'content' => 'Anya passed the technical assessment with flying colors. Proceeding to technical interview.', 'date' => '2026-07-22T15:30:00Z']
                ]
            ],
            [
                'id' => 'app02',
                'candidate_id' => 'cand02',
                'job_id' => 'fsd01',
                'stage_id' => 'offer',
                'applied_date' => '2026-07-12T09:00:00Z',
                'source' => 'Referral',
                'total_score' => 96,
                'scorecard' => [
                    ['name' => 'Experience Match', 'weight' => 0.4, 'score' => 98],
                    ['name' => 'Technical Skills', 'weight' => 0.4, 'score' => 95],
                    ['name' => 'Cultural Fit', 'weight' => 0.2, 'score' => 95],
                ],
                'notes' => [
                    ['author' => 'Diana Prince', 'content' => 'Referral from Yuri. Strong resume, looks very promising.', 'date' => '2026-07-13T09:30:00Z'],
                    ['author' => 'Alex Greene', 'content' => 'Excellent technical interview. Deep knowledge of system architecture. Making an offer.', 'date' => '2026-07-30T16:00:00Z']
                ]
            ],
            [
                'id' => 'app06',
                'candidate_id' => 'cand06',
                'job_id' => 'ux01',
                'stage_id' => 'interview',
                'applied_date' => '2026-07-20T16:00:00Z',
                'source' => 'Dribbble',
                'total_score' => 92,
                'scorecard' => [
                    ['name' => 'Portfolio Quality', 'weight' => 0.5, 'score' => 95],
                    ['name' => 'User Research', 'weight' => 0.3, 'score' => 88],
                    ['name' => 'Communication', 'weight' => 0.2, 'score' => 90],
                ],
            ],
            [
                'id' => 'app17',
                'candidate_id' => 'cand16',
                'job_id' => 'ux01',
                'stage_id' => 'screening',
                'applied_date' => '2026-07-25T14:00:00Z',
                'source' => 'LinkedIn',
                'total_score' => 84,
            ]
        ];
        foreach ($applications as $a) {
            Application::updateOrCreate(['id' => $a['id']], $a);
        }

        // 9. Interviews
        $interviews = [
            [
                'id' => 'iv01',
                'application_id' => 'app01',
                'type' => 'Technical Interview',
                'date_time' => '2026-08-05T14:00:00Z',
                'interviewers' => [
                    ['id' => 'int02', 'name' => 'Brenda Smith', 'role' => 'Senior Engineer'],
                    ['id' => 'int03', 'name' => 'Charles Brown', 'role' => 'Lead Engineer']
                ],
                'location_or_link' => 'https://meet.google.com/xyz-abc-def',
                'status' => 'Completed',
                'recommendation' => 'Hire',
                'scorecard' => [
                    ['competency' => 'React', 'rating' => 4, 'notes' => 'Strong understanding of hooks and state management.'],
                    ['competency' => 'Node.js', 'rating' => 3, 'notes' => 'Good, but could be more familiar with advanced concepts.'],
                    ['competency' => 'System Design', 'rating' => 4, 'notes' => 'Excellent approach to a sample problem.']
                ]
            ],
            [
                'id' => 'iv07',
                'application_id' => 'app02',
                'type' => 'Panel Interview',
                'date_time' => '2026-07-28T10:00:00Z',
                'interviewers' => [
                    ['id' => 'int01', 'name' => 'Alex Greene', 'role' => 'Hiring Manager'],
                    ['id' => 'int03', 'name' => 'Charles Brown', 'role' => 'Lead Engineer']
                ],
                'location_or_link' => 'On-site: Jakarta Office',
                'status' => 'Completed',
                'recommendation' => 'Strong Hire',
                'scorecard' => [
                    ['competency' => 'System Design', 'rating' => 5, 'notes' => 'Deeply impressive architectural knowledge.'],
                    ['competency' => 'CI/CD', 'rating' => 5, 'notes' => 'Expert level understanding of deployment pipelines.']
                ]
            ]
        ];
        foreach ($interviews as $iv) {
            Interview::updateOrCreate(['id' => $iv['id']], $iv);
        }

        // 10. Tasks
        $tasks = [
            ['id' => 'task01', 'application_id' => 'app01', 'title' => 'Review technical assessment results', 'due_date' => '2026-08-10', 'assignee_id' => 'int01', 'status' => 'To Do'],
            ['id' => 'task02', 'application_id' => 'app01', 'title' => 'Follow up with candidate about availability', 'due_date' => '2026-08-08', 'assignee_id' => 'int04', 'status' => 'Completed'],
            ['id' => 'task06', 'application_id' => 'app02', 'title' => 'Prepare offer letter details for Loid Forger', 'due_date' => '2026-07-31', 'assignee_id' => 'int04', 'status' => 'Completed']
        ];
        foreach ($tasks as $t) {
            Task::updateOrCreate(['id' => $t['id']], $t);
        }
    }
}
