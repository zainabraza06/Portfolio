import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    if (typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }
    const project = new Project(data);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = req.file.path;
    if (typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }
    const updated = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const syncGitHub = async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/users/zainabraza06/repos?sort=updated&per_page=100');
    if (!response.ok) throw new Error('Failed to fetch from GitHub');
    const repos = await response.json();
    
    let added = 0;
    let updated = 0;

    for (const repo of repos) {
      if (repo.fork) continue; // skip forks
      const existing = await Project.findOne({ githubId: repo.id.toString() });
      if (existing) {
        // Optionally update description if empty
        if (!existing.description && repo.description) {
           existing.description = repo.description;
           await existing.save();
           updated++;
        }
      } else {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = repo.description?.match(urlRegex);
        const liveUrl = repo.homepage || (match ? match[0] : '');
        
        await Project.create({
          title: repo.name.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
          description: repo.description || 'GitHub Repository',
          techStack: repo.language ? [repo.language] : [],
          githubUrl: repo.html_url,
          liveUrl: liveUrl,
          githubId: repo.id.toString()
        });
        added++;
      }
    }
    res.json({ message: `GitHub Sync Complete: ${added} added, ${updated} updated.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
