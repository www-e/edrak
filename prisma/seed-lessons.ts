import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates lesson data for each course
 */
async function createLessons(courses: any[]) {
  // Define lesson content for each course
  const courseLessonsData: { [key: string]: Array<{title: string, content: string}> } = {
    'Advanced Physical Training Techniques': [
      {
        title: 'Introduction to Periodization',
        content: 'Learn the fundamentals of periodization, its importance in training cycles, and how to structure effective training blocks.'
      },
      {
        title: 'Strength Training Fundamentals',
        content: 'Master the basic principles of strength training including load, volume, and progression for optimal results.'
      },
      {
        title: 'Power and Explosiveness Training',
        content: 'Develop power and explosive movements through specialized training techniques and exercises.'
      },
      {
        title: 'Endurance Training Methods',
        content: 'Explore various endurance training approaches for different sports and fitness goals.'
      },
      {
        title: 'Recovery and Regeneration Techniques',
        content: 'Learn the importance of recovery in training and various techniques to enhance regeneration.'
      },
      {
        title: 'Injury Prevention Strategies',
        content: 'Develop and implement strategies to prevent common training injuries and enhance movement quality.'
      },
      {
        title: 'Nutrition for Training Performance',
        content: 'Understand how to fuel your body for optimal training performance and recovery.'
      },
      {
        title: 'Flexibility and Mobility Training',
        content: 'Incorporate flexibility and mobility work into your training program for improved performance.'
      },
      {
        title: 'Assessment and Testing Protocols',
        content: 'Learn how to assess fitness levels and track progress using various testing protocols.'
      },
      {
        title: 'Training Program Design',
        content: 'Design comprehensive training programs tailored to specific goals and needs.'
      }
    ],
    'Sports Nutrition for Peak Performance': [
      {
        title: 'Macronutrients and Energy Systems',
        content: 'Understand the role of carbohydrates, proteins, and fats in athletic performance and energy systems.'
      },
      {
        title: 'Hydration Strategies for Athletes',
        content: 'Learn optimal hydration strategies for different training conditions and sports.'
      },
      {
        title: 'Pre-Workout Nutrition',
        content: 'Discover the best nutrition strategies to fuel your workouts and enhance performance.'
      },
      {
        title: 'Post-Workout Recovery Nutrition',
        content: 'Optimize recovery with proper post-workout nutrition to enhance adaptation and reduce fatigue.'
      },
      {
        title: 'Sport-Specific Nutrition',
        content: 'Tailor nutrition strategies to the specific demands of different sports and activities.'
      },
      {
        title: 'Supplementation for Athletes',
        content: 'Evaluate the evidence behind common sports supplements and their appropriate use.'
      },
      {
        title: 'Weight Management for Athletes',
        content: 'Maintain optimal body composition while supporting training and performance goals.'
      },
      {
        title: 'Nutrition Timing and Periodization',
        content: 'Align your nutrition with training cycles for enhanced adaptation and performance.'
      },
      {
        title: 'Gut Health and Performance',
        content: 'Understand the role of gut health in nutrient absorption and overall athletic performance.'
      },
      {
        title: 'Nutrition Assessment and Planning',
        content: 'Assess individual nutritional needs and create personalized nutrition plans.'
      }
    ],
    'Professional Diving Techniques and Safety': [
      {
        title: 'Diving Physics and Gas Laws',
        content: 'Understand the physics principles that govern diving including pressure, gas laws, and their effects on the human body.'
      },
      {
        title: 'Diving Equipment Overview',
        content: 'Learn about different types of diving equipment and their proper use and maintenance.'
      },
      {
        title: 'Breathing Techniques and Air Management',
        content: 'Master proper breathing techniques and air management strategies for safe diving.'
      },
      {
        title: 'Dive Planning and Safety Protocols',
        content: 'Create detailed dive plans and implement safety protocols for various diving scenarios.'
      },
      {
        title: 'Underwater Navigation',
        content: 'Develop skills in underwater navigation using compass and natural landmarks.'
      },
      {
        title: 'Emergency Procedures and Rescue',
        content: 'Learn emergency procedures and rescue techniques to handle diving incidents.'
      },
      {
        title: 'Diving Medical Considerations',
        content: 'Understand medical factors that affect diving safety and fitness to dive.'
      },
      {
        title: 'Environmental Awareness and Protection',
        content: 'Develop awareness of underwater environments and practice responsible diving to protect marine life.'
      },
      {
        title: 'Advanced Diving Techniques',
        content: 'Master advanced diving techniques for different environments and conditions.'
      },
      {
        title: 'Dive Log and Experience Tracking',
        content: 'Maintain accurate dive logs and track experience for continuous improvement.'
      }
    ],
    'Physics of Human Movement': [
      {
        title: 'Basic Mechanics in Human Motion',
        content: 'Introduction to kinematics and kinetics applied to human movement and exercise.'
      },
      {
        title: 'Forces and Motion in Sports',
        content: 'Understand how different forces affect movement in various sports and activities.'
      },
      {
        title: 'Levers and Joint Mechanics',
        content: 'Explore how the human body uses lever systems to create movement and generate force.'
      },
      {
        title: 'Energy Systems in Exercise',
        content: 'Understand potential, kinetic, and thermal energy in the context of human movement.'
      },
      {
        title: 'Friction and Its Impact on Movement',
        content: 'Learn how friction affects different types of movement and sports performance.'
      },
      {
        title: 'Center of Gravity and Balance',
        content: 'Understand concepts of center of gravity and how it affects balance and stability.'
      },
      {
        title: 'Angular Motion and Rotation',
        content: 'Explore angular motion and its applications in sports and exercise movements.'
      },
      {
        title: 'Projectile Motion in Sports',
        content: 'Apply projectile motion principles to analyze sports movements like throwing, kicking, and jumping.'
      },
      {
        title: 'Fluid Mechanics in Swimming',
        content: 'Understand drag, lift, and propulsion in aquatic movement and swimming technique.'
      },
      {
        title: 'Physics Applications in Coaching',
        content: 'Use physics principles to improve technique and performance in various sports.'
      }
    ],
    'Sports-Specific Training Programs': [
      {
        title: 'Football Training Protocols',
        content: 'Develop training programs specific to the demands of football including speed, agility, and power development.'
      },
      {
        title: 'Basketball Conditioning and Skills',
        content: 'Create conditioning and training programs that enhance basketball-specific skills and performance.'
      },
      {
        title: 'Tennis Movement and Strength',
        content: 'Design training programs that develop the movement and strength qualities required for tennis.'
      },
      {
        title: 'Track and Field Training Methods',
        content: 'Specialized training approaches for sprinting, jumping, and throwing events.'
      },
      {
        title: 'Volleyball Power and Coordination',
        content: 'Develop explosive power and coordination for volleyball performance.'
      },
      {
        title: 'Combat Sports Conditioning',
        content: 'Training methods specific to boxing, MMA, and other combat sports.'
      },
      {
        title: 'Team Sport Periodization',
        content: 'Plan training cycles that align with sports seasons and competition schedules.'
      },
      {
        title: 'Youth Athletic Development',
        content: 'Age-appropriate training methods for young athletes in different sports.'
      },
      {
        title: 'Injury Rehabilitation in Sports',
        content: 'Develop training programs that support injury rehabilitation and return to sport.'
      },
      {
        title: 'Performance Assessment in Sports',
        content: 'Use testing protocols specific to each sport to assess and track athlete performance.'
      }
    ],
    'Functional Fitness for Daily Living': [
      {
        title: 'Introduction to Functional Movement',
        content: 'Understand what functional fitness is and how it applies to everyday activities.'
      },
      {
        title: 'Squatting and Hip Dominant Movements',
        content: 'Master functional squatting patterns and hip dominant movements that help with daily tasks.'
      },
      {
        title: 'Pushing and Pulling Movements',
        content: 'Learn safe and effective pushing and pulling movements that reflect daily life patterns.'
      },
      {
        title: 'Loaded Carries and Core Stability',
        content: 'Develop core stability and carrying strength for everyday tasks.'
      },
      {
        title: 'Balance and Coordination Training',
        content: 'Improve balance and coordination to reduce fall risk and enhance movement quality.'
      },
      {
        title: 'Flexibility and Mobility for Daily Tasks',
        content: 'Incorporate flexibility and mobility work to maintain range of motion for daily activities.'
      },
      {
        title: 'Movement Quality Assessment',
        content: 'Assess movement patterns and identify limitations that affect daily function.'
      },
      {
        title: 'Gait and Walking Patterns',
        content: 'Optimize walking patterns and gait for efficient movement and reduced injury risk.'
      },
      {
        title: 'Functional Training Equipment',
        content: 'Learn to use various equipment to enhance functional movement training.'
      },
      {
        title: 'Functional Training Program Design',
        content: 'Design comprehensive functional training programs tailored to individual needs.'
      }
    ],
    'Mindful Eating and Nutrition Habits': [
      {
        title: 'Introduction to Mindful Eating',
        content: 'Understand the concept of mindful eating and its benefits for health and well-being.'
      },
      {
        title: 'Recognizing Hunger and Satiety Cues',
        content: 'Learn to identify and respond appropriately to internal hunger and fullness signals.'
      },
      {
        title: 'Emotional Eating and Stress',
        content: 'Identify triggers for emotional eating and develop strategies to manage stress without food.'
      },
      {
        title: 'Creating a Mindful Eating Environment',
        content: 'Set up your eating environment to promote mindful consumption.'
      },
      {
        title: 'Mindful Preparation and Cooking',
        content: 'Practice mindfulness in food preparation and cooking processes.'
      },
      {
        title: 'Food Neutrality and Judgment',
        content: 'Develop a neutral relationship with food without labeling foods as "good" or "bad".'
      },
      {
        title: 'Eating Without Distractions',
        content: 'Learn to eat without distractions and develop focused eating practices.'
      },
      {
        title: 'Cultural and Social Aspects of Eating',
        content: 'Understand how social and cultural aspects impact eating behaviors.'
      },
      {
        title: 'Sustainable Nutrition Habits',
        content: 'Develop sustainable nutrition habits that promote long-term health.'
      },
      {
        title: 'Mindful Eating in Various Situations',
        content: 'Practice mindful eating in social, workplace, and restaurant settings.'
      }
    ],
    'Diving Equipment Maintenance and Troubleshooting': [
      {
        title: 'Regulator Maintenance and Care',
        content: 'Learn proper maintenance procedures for diving regulators to ensure optimal performance and safety.'
      },
      {
        title: 'BCD Care and Servicing',
        content: 'Proper cleaning, storage, and maintenance of buoyancy control devices.'
      },
      {
        title: 'Dive Computer Operation and Care',
        content: 'Understanding dive computer functions and proper maintenance procedures.'
      },
      {
        title: 'Wetsuit and Drysuit Maintenance',
        content: 'Proper care and maintenance of exposure protection gear.'
      },
      {
        title: 'Fins, Masks, and Snorkel Care',
        content: 'Maintaining and troubleshooting basic diving accessories.'
      },
      {
        title: 'Tank Inspection and Safety',
        content: 'Understanding tank inspection requirements and safety protocols.'
      },
      {
        title: 'Troubleshooting Common Equipment Issues',
        content: 'Identify and solve common equipment problems before they impact diving safety.'
      },
      {
        title: 'Equipment Storage and Transportation',
        content: 'Best practices for storing and transporting diving equipment.'
      },
      {
        title: 'Equipment Selection and Upgrades',
        content: 'Choosing the right equipment for your diving needs and when to upgrade.'
      },
      {
        title: 'Equipment Performance Tracking',
        content: 'Monitor equipment performance and maintenance schedules for optimal reliability.'
      }
    ],
    'Biomechanics of Swimming': [
      {
        title: 'Introduction to Swimming Biomechanics',
        content: 'Overview of how biomechanics principles apply to swimming technique and performance.'
      },
      {
        title: 'Stroke Mechanics and Efficiency',
        content: 'Analyze the biomechanics of different swimming strokes to improve efficiency.'
      },
      {
        title: 'Propulsion and Drag in Water',
        content: 'Understanding how swimmers generate propulsion and minimize drag forces.'
      },
      {
        title: 'Body Position and Streamlining',
        content: 'The role of body position in reducing resistance and improving swimming speed.'
      },
      {
        title: 'Kick Mechanics and Power',
        content: 'Biomechanics of the flutter kick, dolphin kick, and breaststroke kick.'
      },
      {
        title: 'Pull Mechanics and Catch',
        content: 'How to maximize the effectiveness of the pulling phase in each stroke.'
      },
      {
        title: 'Breathing Technique and Timing',
        content: 'The biomechanics of breathing during swimming and its impact on performance.'
      },
      {
        title: 'Bilateral Coordination and Rhythm',
        content: 'How to develop efficient bilateral coordination in swimming strokes.'
      },
      {
        title: 'Stroke Rate and Distance per Stroke',
        content: 'Biomechanical considerations for optimizing stroke rate and distance per stroke.'
      },
      {
        title: 'Injury Prevention Through Biomechanics',
        content: 'Using biomechanical principles to identify and correct stroke patterns that may lead to injury.'
      }
    ],
    'Recovery and Regeneration for Athletes': [
      {
        title: 'Understanding Recovery and Adaptation',
        content: 'Learn the physiological processes that drive recovery and adaptation to training.'
      },
      {
        title: 'Sleep and Performance',
        content: 'The critical role of sleep in recovery, performance, and long-term athletic development.'
      },
      {
        title: 'Active Recovery Techniques',
        content: 'Low-intensity activities and techniques that promote recovery without adding stress.'
      },
      {
        title: 'Compression and Circulation',
        content: 'How compression garments and techniques can enhance circulation and recovery.'
      },
      {
        title: 'Contrast Therapy and Temperature',
        content: 'Using hot and cold therapy to promote recovery and reduce inflammation.'
      },
      {
        title: 'Massage and Manual Therapy',
        content: 'Benefits of massage therapy and other manual techniques for recovery.'
      },
      {
        title: 'Nutritional Recovery Strategies',
        content: 'Specific nutrition approaches to support recovery processes.'
      },
      {
        title: 'Mental Recovery and Stress Management',
        content: 'Techniques for mental recovery and managing stress in athletes.'
      },
      {
        title: 'Recovery Monitoring and Assessment',
        content: 'Tools and techniques to monitor recovery and adjust training accordingly.'
      },
      {
        title: 'Recovery Planning and Periodization',
        content: 'Incorporating recovery into periodized training plans for optimal performance.'
      }
    ],
  };

  // Create lessons for each course
  for (const course of courses) {
    const lessonsForCourse = courseLessonsData[course.title];
    if (!lessonsForCourse) {
      console.log(`No lessons defined for course: ${course.title}`);
      continue;
    }

    for (let i = 0; i < lessonsForCourse.length; i++) {
      const lessonData = lessonsForCourse[i];
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          order: i + 1,
          course: {
            connect: { id: course.id }
          }
        }
      });
      console.log(`Lesson created: ${lessonData.title} (Course: ${course.title})`);
    }
  }
}

export { createLessons };