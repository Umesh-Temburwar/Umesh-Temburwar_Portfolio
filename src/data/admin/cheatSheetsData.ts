export interface CheatSheetSection {
  id: string;
  title: string;
  category: string;
  items: {
    commandOrTerm: string;
    description: string;
    example?: string;
  }[];
}

export const cheatSheetsData: CheatSheetSection[] = [
  {
    id: 'git-cheatsheet',
    title: 'Git Version Control Power Commands',
    category: 'DevOps & Tools',
    items: [
      {
        commandOrTerm: 'git checkout -b <branch>',
        description: 'Create and switch to a new branch in one step.',
        example: 'git checkout -b feature/edtech-quiz-timer'
      },
      {
        commandOrTerm: 'git stash push -m "msg" / git stash pop',
        description: 'Save uncommitted work temporarily and restore it later.',
        example: 'git stash push -m "wip: quiz logic" && git stash pop'
      },
      {
        commandOrTerm: 'git rebase -i HEAD~n',
        description: 'Interactive rebase to squash, edit, or reword the last n commits.',
        example: 'git rebase -i HEAD~3'
      },
      {
        commandOrTerm: 'git cherry-pick <commit-hash>',
        description: 'Apply specific commit changes from another branch without full merge.',
        example: 'git cherry-pick a1b2c3d'
      },
      {
        commandOrTerm: 'git reset --soft HEAD~1',
        description: 'Undo the last commit while keeping all changes staged in the index.',
        example: 'git reset --soft HEAD~1'
      },
      {
        commandOrTerm: 'git reset --hard HEAD',
        description: 'Discard all uncommitted changes and revert working directory to HEAD.',
        example: 'git reset --hard HEAD'
      },
      {
        commandOrTerm: 'git diff --staged',
        description: 'View changes that are staged for the next commit.',
        example: 'git diff --staged'
      },
      {
        commandOrTerm: 'git log --oneline --graph --decorate',
        description: 'Compact visual ASCII tree of branches and commit history.',
        example: 'git log --oneline --graph --decorate -n 10'
      }
    ]
  },
  {
    id: 'linux-cheatsheet',
    title: 'Linux Server & Terminal Commands',
    category: 'System Administration',
    items: [
      {
        commandOrTerm: 'htop / top',
        description: 'Interactive real-time process viewer and system resource monitor.',
        example: 'htop'
      },
      {
        commandOrTerm: 'ps aux | grep <process_name>',
        description: 'List all running processes and filter by name/PID.',
        example: 'ps aux | grep node'
      },
      {
        commandOrTerm: 'kill -9 <PID>',
        description: 'Forcefully terminate an unresponsive process by its PID.',
        example: 'kill -9 1234'
      },
      {
        commandOrTerm: 'netstat -tuln / ss -tulpn',
        description: 'Inspect active listening TCP and UDP sockets and open ports.',
        example: 'ss -tulpn | grep 3000'
      },
      {
        commandOrTerm: 'df -h && du -sh *',
        description: 'Display disk filesystem space and directory size breakdowns in human-readable format.',
        example: 'df -h'
      },
      {
        commandOrTerm: 'grep -rnw "text" /path/',
        description: 'Recursively search for an exact word in all files within a directory.',
        example: 'grep -rnw "UnhandledPromiseRejection" /var/log/'
      },
      {
        commandOrTerm: 'tail -f -n 100 app.log',
        description: 'Output the last 100 lines and continuously follow live log file updates.',
        example: 'tail -f app.log'
      },
      {
        commandOrTerm: 'chmod 755 / chown user:group',
        description: 'Modify file permissions (rwx) and change file ownership.',
        example: 'chmod 755 deploy.sh'
      },
      {
        commandOrTerm: 'journalctl -u <service> -f',
        description: 'View and stream systemd service logs in real time.',
        example: 'journalctl -u nginx -f'
      }
    ]
  },
  {
    id: 'docker-cheatsheet',
    title: 'Docker & Containerization Commands',
    category: 'DevOps & Containers',
    items: [
      {
        commandOrTerm: 'docker build -t <tag> .',
        description: 'Build a Docker image from a Dockerfile in the current directory.',
        example: 'docker build -t umesh/edtech-api:v1 .'
      },
      {
        commandOrTerm: 'docker run -d -p 3000:3000 --name <name> <image>',
        description: 'Run container in background (detached) with port forwarding.',
        example: 'docker run -d -p 3000:3000 --name web app:v1'
      },
      {
        commandOrTerm: 'docker ps -a',
        description: 'List all running and stopped containers with status and port mappings.',
        example: 'docker ps -a'
      },
      {
        commandOrTerm: 'docker exec -it <container_id> /bin/sh',
        description: 'Open an interactive terminal shell inside a running container.',
        example: 'docker exec -it web_app /bin/sh'
      },
      {
        commandOrTerm: 'docker logs -f <container_id>',
        description: 'Fetch and follow the stdout/stderr logs of a running container.',
        example: 'docker logs -f --tail 50 web_app'
      },
      {
        commandOrTerm: 'docker system prune -a --volumes',
        description: 'Remove all unused containers, networks, images, and dangling volumes.',
        example: 'docker system prune -a'
      },
      {
        commandOrTerm: 'docker compose up -d / down',
        description: 'Start or tear down multi-container services defined in docker-compose.yml.',
        example: 'docker compose up -d'
      }
    ]
  },
  {
    id: 'http-status-codes',
    title: 'HTTP Status Codes & REST Conventions',
    category: 'API Development',
    items: [
      {
        commandOrTerm: '200 OK',
        description: 'Standard successful HTTP response for GET, PUT, PATCH.',
        example: 'Return data payload with 200.'
      },
      {
        commandOrTerm: '201 Created',
        description: 'Resource successfully created; returned after POST with Location header.',
        example: 'New course created.'
      },
      {
        commandOrTerm: '204 No Content',
        description: 'Action succeeded, but response body is intentionally empty (common for DELETE).',
        example: 'Course deleted.'
      },
      {
        commandOrTerm: '400 Bad Request',
        description: 'Client sent invalid payload or schema validation failed.',
        example: 'Missing required email field.'
      },
      {
        commandOrTerm: '401 Unauthorized',
        description: 'Authentication required or token expired/invalid (Identity missing).',
        example: 'Missing Bearer token.'
      },
      {
        commandOrTerm: '403 Forbidden',
        description: 'Authenticated user lacks permission for this action (Role insufficient).',
        example: 'Student accessing admin endpoint.'
      },
      {
        commandOrTerm: '404 Not Found',
        description: 'Target URI resource does not exist.',
        example: 'Course ID not found in database.'
      },
      {
        commandOrTerm: '409 Conflict',
        description: 'Request conflicts with current server state (e.g. duplicate email, race condition).',
        example: 'Email already registered.'
      },
      {
        commandOrTerm: '422 Unprocessable Entity',
        description: 'Syntactically correct request with semantic business logic errors.',
        example: 'Password fails complexity check.'
      },
      {
        commandOrTerm: '429 Too Many Requests',
        description: 'Rate limit exceeded; usually accompanied by Retry-After header.',
        example: 'Exceeded 100 requests per minute.'
      },
      {
        commandOrTerm: '500 Internal Server Error',
        description: 'Unexpected unhandled server exception or crash.',
        example: 'Database connection pool exhausted.'
      },
      {
        commandOrTerm: '502 Bad Gateway / 503 Service Unavailable',
        description: 'Reverse proxy received invalid response or upstream server is down/restarting.',
        example: 'Node app crashed behind Nginx.'
      }
    ]
  }
];

