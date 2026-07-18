const quizSets = {
  images: {
    name: 'DOCKER IMAGES',
    questions: [
      ['What is a Docker image?', ['template', 'read-only', 'package'], 'A Docker image is a read-only template that packages an application, its dependencies, and instructions for creating containers.'],
      ['What are image layers?', ['layer', 'filesystem', 'change'], 'Image layers are stacked, read-only filesystem changes. Docker can reuse unchanged layers to make builds and pulls more efficient.'],
      ['What is a base image?', ['base', 'starting', 'parent'], 'A base image is the starting image in a Dockerfile, usually selected with FROM, such as node, python, alpine, or ubuntu.'],
      ['Which command pulls an image from a registry?', ['docker pull'], 'Use docker pull IMAGE[:TAG], for example: docker pull nginx:latest.'],
      ['Which command searches Docker Hub images?', ['docker search'], 'Use docker search TERM, for example: docker search nginx.'],
      ['Which command lists local images?', ['docker images', 'docker image ls'], 'Use docker images or docker image ls.'],
      ['Which command removes a local image?', ['docker rmi', 'docker image rm'], 'Use docker rmi IMAGE or docker image rm IMAGE.'],
      ['Which command creates another tag for an image?', ['docker tag'], 'Use docker tag SOURCE_IMAGE TARGET_IMAGE[:TAG].'],
      ['Which command shows the layers and commands used to build an image?', ['docker history'], 'Use docker history IMAGE.'],
      ['Which command displays detailed image configuration?', ['docker inspect', 'docker image inspect'], 'Use docker inspect IMAGE or docker image inspect IMAGE.'],
      ['How do you save and load a Docker image archive?', ['docker save', 'docker load'], 'Save with docker save -o image.tar IMAGE, then load with docker load -i image.tar.'],
      ['How do export/import differ from save/load?', ['container', 'filesystem', 'metadata'], 'docker export/import captures a container filesystem but loses image history and metadata. docker save/load preserves an image and its layers/tags.']
    ]
  },
  containers: {
    name: 'DOCKER CONTAINERS',
    questions: [
      ['What is a Docker container?', ['running', 'instance', 'image'], 'A container is a runnable, isolated instance of an image, with its own process and writable layer.'],
      ['Which command creates a container without starting it?', ['docker create'], 'Use docker create IMAGE. It creates the container but does not start it.'],
      ['Which command creates and starts a container?', ['docker run'], 'Use docker run IMAGE. It creates a new container and starts it.'],
      ['Which command starts an existing stopped container?', ['docker start'], 'Use docker start CONTAINER.'],
      ['Which command gracefully stops a running container?', ['docker stop'], 'Use docker stop CONTAINER. Docker sends SIGTERM, then SIGKILL after the timeout if needed.'],
      ['Which command restarts a container?', ['docker restart'], 'Use docker restart CONTAINER.'],
      ['Which commands pause and unpause a container?', ['docker pause', 'docker unpause'], 'Use docker pause CONTAINER and docker unpause CONTAINER.'],
      ['Which command immediately terminates a container process?', ['docker kill'], 'Use docker kill CONTAINER.'],
      ['Which command removes a stopped container?', ['docker rm', 'docker container rm'], 'Use docker rm CONTAINER. Add -f only when you intentionally need to remove a running container.'],
      ['Which command changes a container name?', ['docker rename'], 'Use docker rename OLD_NAME NEW_NAME.'],
      ['Which command displays detailed container configuration?', ['docker inspect', 'docker container inspect'], 'Use docker inspect CONTAINER.'],
      ['Which command shows a container’s output?', ['docker logs'], 'Use docker logs CONTAINER.'],
      ['Which command runs a command inside a running container?', ['docker exec'], 'Use docker exec CONTAINER COMMAND, often docker exec -it CONTAINER sh.'],
      ['How do you attach to and detach from a container?', ['docker attach', 'detach'], 'Use docker attach CONTAINER to connect to its main process. Detach without stopping it with Ctrl-p then Ctrl-q.'],
      ['Name the common container lifecycle states.', ['created', 'running', 'paused', 'stopped', 'exited'], 'Common states are created, running, paused, and exited/stopped; a container can also be removed.']
    ]
  }
};

let topic, index, correct;
const picker = document.querySelector('#topic-picker');
const quiz = document.querySelector('#quiz');
const complete = document.querySelector('#complete');
const question = document.querySelector('#question');
const answer = document.querySelector('#answer');
const feedback = document.querySelector('#feedback');
const checkButton = document.querySelector('#check-answer');
const nextButton = document.querySelector('#next-question');

function begin(topicKey) {
  topic = topicKey; index = 0; correct = 0;
  picker.classList.add('hidden'); complete.classList.add('hidden'); quiz.classList.remove('hidden');
  renderQuestion();
}
function renderQuestion() {
  const set = quizSets[topic], item = set.questions[index];
  document.querySelector('#topic-label').textContent = set.name;
  document.querySelector('#progress').textContent = `Question ${index + 1} of ${set.questions.length}`;
  question.textContent = item[0]; answer.value = ''; answer.disabled = false; answer.focus();
  feedback.className = 'feedback hidden'; feedback.textContent = '';
  checkButton.classList.remove('hidden'); nextButton.classList.add('hidden');
}
function normalise(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function checkAnswer() {
  const response = normalise(answer.value), item = quizSets[topic].questions[index];
  if (!response) { feedback.className = 'feedback incorrect'; feedback.innerHTML = '<strong>Please type an answer first.</strong>'; return; }
  const isCorrect = item[1].every(keyword => response.includes(normalise(keyword)));
  if (isCorrect) correct++;
  feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong>${item[2]}`;
  answer.disabled = true; checkButton.classList.add('hidden'); nextButton.classList.remove('hidden');
}
function next() {
  index++;
  if (index < quizSets[topic].questions.length) renderQuestion();
  else { quiz.classList.add('hidden'); complete.classList.remove('hidden'); document.querySelector('#score-summary').textContent = `You answered ${correct} of ${quizSets[topic].questions.length} questions correctly.`; }
}
document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => begin(button.dataset.topic)));
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', next);
answer.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !answer.disabled) checkAnswer(); });
document.querySelector('#change-topic').addEventListener('click', () => { quiz.classList.add('hidden'); picker.classList.remove('hidden'); });
document.querySelector('#choose-another').addEventListener('click', () => { complete.classList.add('hidden'); picker.classList.remove('hidden'); });
