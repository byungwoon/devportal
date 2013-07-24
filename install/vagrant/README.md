#Vagrant Development Box

1. Clone this repo and checkout the 'releases' branch.

  `git clone git@github.com:apigee/apigee-drupal -b releases`

2. Install [Virtualbox](http://virtualbox.org) and [Vagrant](http://www.vagrantup.com). 

3. Make sure you restart your terminal app so the new paths to vagrant and virtual box take effect in the command window. 

4. CD to this directory and type "vagrant up" and a new virtual server is created with the portal and docs install waiting for you to use.

5. There's a shared folder in this folder called "vm_shared". it will be the virtualbox's /var/www/html directory with the portal installed files.

6. Make 2 entries in your /etc/hosts file:

  `127.0.0.1 docs.local`

  `127.0.0.1 portal.local`

1. Navigate to [http://docs.local:8080](http://docs.local:8080) and/or [http://portal.local:8080](http://portal.local:8080) should give you the docs site and the portal. 

1. To ssh to the running VM, simply type `vagrant ssh` in this folder. Once logged in you can `sudo su` to become root.
1. To shut down your virtual box instance run 'vagrant halt'
1. To restart your virtual box instance run 'vagrant up --no-provision' 
1. To start over from scratch, `vagrant destroy`. This will stop the server, destroy any changes you've made to vm_shared, and clean your hard drive of any lingering cloned drives. 

1. In the virtualbox GUI you can see this instance running with a green arrow beside it and control it by right-clicking. 

###Links

[Install git](http://git-scm.com)

[Vagrant Documentation](http://docs.vagrantup.com/v2/) 

[Virtualbox Documentation](https://www.virtualbox.org/manual/UserManual.html)

[CentOS Howto](http://wiki.centos.org/HowTos)

