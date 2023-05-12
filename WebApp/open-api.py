from threading import Thread

import openai
from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS, cross_origin
import requests
import tiktoken as tiktoken

app = Flask(__name__)
CORS(app)
app.app_context()

openai.api_key = "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"

preprompt = "Ecris moi une réponse pour le mail suivant : \n\n"

prompt = """
Resalut,
 
du coup je t’ai inscrit pour la session du 08.05.2023.
 
je tenais à te rappeler que si tu es face à un imprévu qui nécessite une annulation, tu dois en premier lieu contacter @personne avant de te désinscrire des formations.
 
Je te rappel aussi que ces formations sont obligatoires et que tu ne peux pas en disposer de la sorte quand bon te semble.
 
Si tu as des questions, je reste à disposition.
"""

messages = [
    {"role": "user", "content": f"{preprompt} {prompt}"},
]

model = "gpt-3.5-turbo"

responses = []
msg_queue = []

def user_input(input):
    msg = input
    """
    Resalut,
     
    du coup je t’ai inscrit pour la session du 08.05.2023.
     
    je tenais à te rappeler que si tu es face à un imprévu qui nécessite une annulation, tu dois en premier lieu contacter @personne avant de te désinscrire des formations.
     
    Je te rappel aussi que ces formations sont obligatoires et que tu ne peux pas en disposer de la sorte quand bon te semble.
     
    Si tu as des questions, je reste à disposition.
    """
    msg_queue.append({"role": "user", "content": f"{preprompt} {msg}"})


@app.route('/<input>', methods=['GET'])
#@cross_origin()
def index(input):
    user_input_thread = Thread(target=user_input, args=(input,))
    fetch_completion_thread = Thread(target=get_completion_openai)

    user_input_thread.start()
    fetch_completion_thread.start()

    user_input_thread.join()
    fetch_completion_thread.join()

    return jsonify(responses[responses.__len__() - 1])


def get_completion_openai():
    response = openai.ChatCompletion.create(
        model=model,
        messages=msg_queue,
        temperature=0.7
    )

    print(response.choices[0].message["content"])
    print(response.usage.prompt_tokens, " tokens for prompt.")
    print(response.usage.completion_tokens, " tokens for completion.")
    print(response.usage.total_tokens, " tokens total.")

    responses.append(response)

# If we want to use the token count for the sending prompt.
def num_tokens_from_messages(messages, model="gpt-3.5-turbo"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    if model == "gpt-3.5-turbo":  # note: future models may deviate from this
        num_tokens = 0
        for message in messages:
            num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return num_tokens
    else:
        raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.
  See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")


# Swagger UI setup
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        "app_name": "OpenAI API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

app.run(debug=True)

#print(num_tokens_from_messages(messages, model), " tokens have been used for this request.")
