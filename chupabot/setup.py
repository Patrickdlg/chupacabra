from setuptools import setup, find_packages

setup(name='chupabot',
      url="https://decentralabs.io",
      author_email="hi@decentralabs.io",
      version='0.0.1',
      packages=find_packages(),
      zip_safe=False,
      install_requires=[
          'docker==4.3.1',
          'noteworthy-botkit===0.0.3'
      ],
      dependency_links=[
        'git+https://github.com/decentralabs/noteworthy-botkit.git#egg=noteworthy-botkit-0.0.3',
      ],
      entry_points={
        'console_scripts': [
            'chupabot = chupabot.__main__:main'
            ],
        },
     )
