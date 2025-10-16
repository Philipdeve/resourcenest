-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view resources
CREATE POLICY "Resources are viewable by everyone" 
ON public.resources 
FOR SELECT 
USING (true);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on resources
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample resources
INSERT INTO public.resources (title, description, category, type, url) VALUES
('Introduction to Calculus', 'Learn the fundamentals of differential and integral calculus. This comprehensive guide covers limits, derivatives, integrals, and their real-world applications.', 'Mathematics', 'pdf', 'https://example.com/calculus.pdf'),
('Python Programming Basics', 'Complete beginner''s guide to Python programming. Learn syntax, data structures, functions, and object-oriented programming with hands-on examples.', 'Technology', 'video', 'https://www.youtube.com/watch?v=example1'),
('Physics: Motion and Forces', 'Understanding Newton''s laws and their applications in classical mechanics. Explore concepts of velocity, acceleration, force, and energy.', 'Science', 'pdf', 'https://example.com/physics.pdf'),
('Data Structures Explained', 'Comprehensive guide to common data structures including arrays, linked lists, stacks, queues, trees, and graphs.', 'Technology', 'video', 'https://www.youtube.com/watch?v=example2'),
('Organic Chemistry Fundamentals', 'Introduction to organic chemistry covering molecular structures, functional groups, and basic reaction mechanisms.', 'Science', 'pdf', 'https://example.com/chemistry.pdf'),
('Linear Algebra Essentials', 'Master vectors, matrices, eigenvalues, and linear transformations. Essential mathematics for machine learning and computer graphics.', 'Mathematics', 'pdf', 'https://example.com/linear-algebra.pdf'),
('Introduction to Robotics', 'Learn the basics of robotics engineering including sensors, actuators, control systems, and programming autonomous robots.', 'Engineering', 'video', 'https://www.youtube.com/watch?v=example3'),
('Web Development Fundamentals', 'Complete guide to HTML, CSS, and JavaScript. Build responsive websites from scratch with modern web technologies.', 'Technology', 'video', 'https://www.youtube.com/watch?v=example4');