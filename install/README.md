#Apigee drupal install scripts

This folder contains install scripts for Apigee-Drupal. The primary install script is named

`centos-install-apigee-drupal.sh`

These are designed and tested on clean CENTOS 6.3 but should work with any CENTOS 6.x version.

To run the script for a development environment, cd to the directory install/vagrant and follow the README instructions there.

##Packages:

The following is a list of pages installed/updated and the dependencies they install/update:

<table>
<thead>
  <tr>
    <th>Package</th>
    <th>Arch</th>
    <th>Version</th>
    <th>Repo</th>
    <th>Size</th>
  </tr>
</thead>
<tbody>
<tr><th colspan="5"><br><h3> Installing </h3></th></tr>
<tr><td> ImageMagick         </td><td>x86__64</td><td> 6.5.4.7-6.el6_2            </td><td>base   </td><td>1.7 M</td></tr>
<tr><td> ImageMagick-devel   </td><td>x86__64</td><td> 6.5.4.7-6.el6_2            </td><td>base   </td><td>86 k</td></tr>
<tr><td> gd                  </td><td>x86__64</td><td> 2.0.35-11.el6              </td><td>base   </td><td>142 k</td></tr>
<tr><td> gd-devel            </td><td>x86__64</td><td> 2.0.35-11.el6              </td><td>base   </td><td>78 k</td></tr>
<tr><td> git                 </td><td>x86__64</td><td> 1.7.1-3.el6_4.1            </td><td>updates</td><td>4.6 M</td></tr>
<tr><td> httpd               </td><td>x86__64</td><td> 2.2.15-26.el6.centos       </td><td>base   </td><td>821 k</td></tr>
<tr><td> mysql               </td><td>x86__64</td><td> 5.1.67-1.el6_3             </td><td>updates</td><td>886 k</td></tr>
<tr><td> mysql-server        </td><td>x86__64</td><td> 5.1.67-1.el6_3             </td><td>updates</td><td>8.6 M</td></tr>
<tr><td> php54               </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>2.7 M</td></tr>
<tr><td> php54-devel         </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>2.5 M</td></tr>
<tr><td> php54-gd            </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>115 k</td></tr>
<tr><td> php54-mbstring      </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>907 k</td></tr>
<tr><td> php54-mcrypt        </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>23 k</td></tr>
<tr><td> php54-mysql         </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>109 k</td></tr>
<tr><td> php54-pdo           </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>93 k</td></tr>
<tr><td> php54-pear          </td><td>noarch </td><td> 1:1.9.4-2.ius.el6          </td><td>ius    </td><td>380 k</td></tr>
<tr><td> php54-pecl-apc      </td><td>x86__64</td><td> 3.1.13-1.ius.el6           </td><td>ius    </td><td>99 k</td></tr>
<tr><td> php54-pecl-imagick  </td><td>x86__64</td><td> 3.1.0-RC1.2.ius.el6        </td><td>ius    </td><td>99 k</td></tr>
<tr><td> php54-process       </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>34 k</td></tr>
<tr><td> php54-tidy          </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>28 k</td></tr>
<tr><td> php54-xml           </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>143 k</td></tr>
<tr><td> php54-xmlrpc        </td><td>x86__64</td><td> 5.4.13-1.ius.el6           </td><td>ius    </td><td>43 k</td></tr>
<tr><th colspan="5"><br><h3> Updating </h3></th></tr>
<tr><td> openssl             </td><td> x86__64</td><td>   1.0.0-27.el6_4.2          </td><td> updates</td><td>1.4 M</td></tr>
<tr><td> openssl-devel       </td><td> x86__64</td><td>   1.0.0-27.el6_4.2          </td><td> updates</td><td>1.1 M</td></tr>
<tr><th colspan="5"><br><h3> Installing/depends  </h3></th></tr>
<tr><td> Cons|oleKit         </td><td> x86__64</td><td>   0.4.1-3.el6               </td><td> base  </td><td> 82 k</td></tr>
<tr><td> ConsoleKit-libs     </td><td> x86__64</td><td>   0.4.1-3.el6               </td><td> base  </td><td> 17 k</td></tr>
<tr><td> GConf2              </td><td> x86__64</td><td>   2.28.0-6.el6              </td><td> base  </td><td>964 k</td></tr>
<tr><td> ORBit2              </td><td> x86__64</td><td>   2.14.17-3.2.el6_3         </td><td> base  </td><td>168 k</td></tr>
<tr><td> apr                 </td><td> x86__64</td><td>   1.3.9-5.el6_2             </td><td> base  </td><td>123 k</td></tr>
<tr><td> apr-util            </td><td> x86__64</td><td>   1.3.9-3.el6_0.1           </td><td> base  </td><td> 87 k</td></tr>
<tr><td> apr-util-ldap       </td><td> x86__64</td><td>   1.3.9-3.el6_0.1           </td><td> base  </td><td> 15 k</td></tr>
<tr><td> atk                 </td><td> x86__64</td><td>   1.28.0-2.el6              </td><td> base  </td><td>191 k</td></tr>
<tr><td> autoconf            </td><td> noarch</td><td>  2.63-5.1.el6              </td><td> base  </td><td>781 k</td></tr>
<tr><td> automake            </td><td> noarch</td><td>  1.11.1-4.el6              </td><td> base  </td><td>550 k</td></tr>
<tr><td> avahi-libs          </td><td> x86__64</td><td>   0.6.25-12.el6             </td><td> base  </td><td> 54 k</td></tr>
<tr><td> bzip2-devel         </td><td> x86__64</td><td>   1.0.5-7.el6_0             </td><td> base  </td><td>250 k</td></tr>
<tr><td> cairo               </td><td> x86__64</td><td>   1.8.8-3.1.el6             </td><td> base  </td><td>309 k</td></tr>
<tr><td> cups-libs           </td><td> x86__64</td><td>   1:1.4.2-50.el6_4.4        </td><td> updates</td><td> 316 k</td></tr>
<tr><td> dbus                </td><td> x86__64</td><td>   1:1.2.24-7.el6_3          </td><td> base  </td><td>207 k</td></tr>
<tr><td> eggdbus             </td><td> x86__64</td><td>   0.6-3.el6                 </td><td> base  </td><td> 91 k</td></tr>
<tr><td> fontconfig          </td><td> x86__64</td><td>   2.8.0-3.el6               </td><td> base  </td><td>186 k</td></tr>
<tr><td> fontconfig-devel    </td><td> x86__64</td><td>   2.8.0-3.el6               </td><td> base  </td><td>209 k</td></tr>
<tr><td> freetype            </td><td> x86__64</td><td>   2.3.11-14.el6_3.1         </td><td> updates</td><td> 359 k</td></tr>
<tr><td> freetype-devel      </td><td> x86__64</td><td>   2.3.11-14.el6_3.1         </td><td> updates</td><td> 364 k</td></tr>
<tr><td> ghostscript         </td><td> x86__64</td><td>   8.70-15.el6_4.1           </td><td> updates</td><td> 4.4 M</td></tr>
<tr><td> ghostscript-devel   </td><td> x86__64</td><td>   8.70-15.el6_4.1           </td><td> updates</td><td>  42 k</td></tr>
<tr><td> ghostscript-fonts   </td><td> noarch</td><td>  5.50-23.1.el6             </td><td> base  </td><td>751 k</td></tr>
<tr><td> gnutls              </td><td> x86__64</td><td>   2.8.5-10.el6_4.1          </td><td> updates</td><td> 346 k</td></tr>
<tr><td> gtk2                </td><td> x86__64</td><td>   2.18.9-12.el6             </td><td> base  </td><td>3.3 M</td></tr>
<tr><td> hicolor-icon-theme  </td><td> noarch</td><td>  0.11-1.1.el6              </td><td> base  </td><td> 40 k</td></tr>
<tr><td> httpd-tools         </td><td> x86__64</td><td>   2.2.15-26.el6.centos      </td><td> base  </td><td> 72 k</td></tr>
<tr><td> jasper-devel        </td><td> x86__64</td><td>   1.900.1-15.el6_1.1        </td><td> base  </td><td>374 k</td></tr>
<tr><td> jasper-libs         </td><td> x86__64</td><td>   1.900.1-15.el6_1.1        </td><td> base  </td><td>136 k</td></tr>
<tr><td> lcms-devel          </td><td> x86__64</td><td>   1.19-1.el6                </td><td> base  </td><td> 49 k</td></tr>
<tr><td> lcms-libs           </td><td> x86__64</td><td>   1.19-1.el6                </td><td> base  </td><td>100 k</td></tr>
<tr><td> libICE              </td><td> x86__64</td><td>   1.0.6-1.el6               </td><td> base  </td><td> 53 k</td></tr>
<tr><td> libICE-devel        </td><td> x86__64</td><td>   1.0.6-1.el6               </td><td> base  </td><td> 15 k</td></tr>
<tr><td> libIDL              </td><td> x86__64</td><td>   0.8.13-2.1.el6            </td><td> base  </td><td> 83 k</td></tr>
<tr><td> libSM               </td><td> x86__64</td><td>   1.2.1-2.el6               </td><td> base  </td><td> 37 k</td></tr>
<tr><td> libSM-devel         </td><td> x86__64</td><td>   1.2.1-2.el6               </td><td> base  </td><td> 12 k</td></tr>
<tr><td> libX11              </td><td> x86__64</td><td>   1.5.0-4.el6               </td><td> base  </td><td>584 k</td></tr>
<tr><td> libX11-common       </td><td> noarch</td><td>  1.5.0-4.el6               </td><td> base  </td><td>192 k</td></tr>
<tr><td> libX11-devel        </td><td> x86__64</td><td>   1.5.0-4.el6               </td><td> base  </td><td>1.0 M</td></tr>
<tr><td> libXau              </td><td> x86__64</td><td>   1.0.6-4.el6               </td><td> base  </td><td> 24 k</td></tr>
<tr><td> libXau-devel        </td><td> x86__64</td><td>   1.0.6-4.el6               </td><td> base  </td><td> 14 k</td></tr>
<tr><td> libXcomposite       </td><td> x86__64</td><td>   0.4.3-4.el6               </td><td> base  </td><td> 20 k</td></tr>
<tr><td> libXcursor          </td><td> x86__64</td><td>   1.1.13-2.el6              </td><td> base  </td><td> 37 k</td></tr>
<tr><td> libXdamage          </td><td> x86__64</td><td>   1.1.3-4.el6               </td><td> base  </td><td> 18 k</td></tr>
<tr><td> libXext             </td><td> x86__64</td><td>   1.3.1-2.el6               </td><td> base  </td><td> 35 k</td></tr>
<tr><td> libXext-devel       </td><td> x86__64</td><td>   1.3.1-2.el6               </td><td> base  </td><td> 74 k</td></tr>
<tr><td> libXfixes           </td><td> x86__64</td><td>   5.0-3.el6                 </td><td> base  </td><td> 23 k</td></tr>
<tr><td> libXfont            </td><td> x86__64</td><td>   1.4.5-2.el6               </td><td> base  </td><td>136 k</td></tr>
<tr><td> libXft              </td><td> x86__64</td><td>   2.3.1-2.el6               </td><td> base  </td><td> 55 k</td></tr>
<tr><td> libXi               </td><td> x86__64</td><td>   1.6.1-3.el6               </td><td> base  </td><td> 35 k</td></tr>
<tr><td> libXinerama         </td><td> x86__64</td><td>   1.1.2-2.el6               </td><td> base  </td><td> 20 k</td></tr>
<tr><td> libXpm              </td><td> x86__64</td><td>   3.5.10-2.el6              </td><td> base  </td><td> 51 k</td></tr>
<tr><td> libXpm-devel        </td><td> x86__64</td><td>   3.5.10-2.el6              </td><td> base  </td><td> 33 k</td></tr>
<tr><td> libXrandr           </td><td> x86__64</td><td>   1.4.0-1.el6               </td><td> base  </td><td> 36 k</td></tr>
<tr><td> libXrender          </td><td> x86__64</td><td>   0.9.7-2.el6               </td><td> base  </td><td> 30 k</td></tr>
<tr><td> libXt               </td><td> x86__64</td><td>   1.1.3-1.el6               </td><td> base  </td><td>184 k</td></tr>
<tr><td> libXt-devel         </td><td> x86__64</td><td>   1.1.3-1.el6               </td><td> base  </td><td>481 k</td></tr>
<tr><td> libcroco            </td><td> x86__64</td><td>   0.6.2-5.el6               </td><td> base  </td><td>100 k</td></tr>
<tr><td> libfontenc          </td><td> x86__64</td><td>   1.0.5-2.el6               </td><td> base  </td><td> 24 k</td></tr>
<tr><td> libgsf              </td><td> x86__64</td><td>   1.14.15-5.el6             </td><td> base  </td><td>116 k</td></tr>
<tr><td> libjpeg-turbo       </td><td> x86__64</td><td>   1.2.1-1.el6               </td><td> base  </td><td>174 k</td></tr>
<tr><td> libjpeg-turbo-devel </td><td> x86__64</td><td>   1.2.1-1.el6               </td><td> base  </td><td> 96 k</td></tr>
<tr><td> libmcrypt           </td><td> x86__64</td><td>   2.5.8-9.el6               </td><td> epel  </td><td> 96 k</td></tr>
<tr><td> libpng              </td><td> x86__64</td><td>   2:1.2.49-1.el6_2          </td><td> base  </td><td>182 k</td></tr>
<tr><td> libpng-devel        </td><td> x86__64</td><td>   2:1.2.49-1.el6_2          </td><td> base  </td><td>112 k</td></tr>
<tr><td> librsvg2            </td><td> x86__64</td><td>   2.26.0-5.el6_1.1.0.1.centos</td><td>  base  </td><td>138 k</td></tr>
<tr><td> libtasn1            </td><td> x86__64</td><td>   2.3-3.el6_2.1             </td><td> base  </td><td>238 k</td></tr>
<tr><td> libthai             </td><td> x86__64</td><td>   0.1.12-3.el6              </td><td> base  </td><td>183 k</td></tr>
<tr><td> libtidy             </td><td> x86__64</td><td>   0.99.0-19.20070615.1.el6  </td><td> base  </td><td>127 k</td></tr>
<tr><td> libtiff             </td><td> x86__64</td><td>   3.9.4-9.el6_3             </td><td> base  </td><td>342 k</td></tr>
<tr><td> libtiff-devel       </td><td> x86__64</td><td>   3.9.4-9.el6_3             </td><td> base  </td><td>468 k</td></tr>
<tr><td> libtool-ltdl        </td><td> x86__64</td><td>   2.2.6-15.5.el6            </td><td> base  </td><td> 44 k</td></tr>
<tr><td> libwmf-lite         </td><td> x86__64</td><td>   0.2.8.4-22.el6.centos     </td><td> base  </td><td> 51 k</td></tr>
<tr><td> libxcb              </td><td> x86__64</td><td>   1.8.1-1.el6               </td><td> base  </td><td>110 k</td></tr>
<tr><td> libxcb-devel        </td><td> x86__64</td><td>   1.8.1-1.el6               </td><td> base  </td><td>174 k</td></tr>
<tr><td> libxslt             </td><td> x86__64</td><td>   1.1.26-2.el6_3.1          </td><td> base  </td><td>452 k</td></tr>
<tr><td> mailcap             </td><td> noarch</td><td>  2.1.31-2.el6              </td><td> base  </td><td> 27 k</td></tr>
<tr><td> mysql-libs          </td><td> x86__64</td><td>   5.1.67-1.el6_3            </td><td> updates</td><td>1.2 M</td></tr>
<tr><td> pango               </td><td> x86__64</td><td>   1.28.1-7.el6_3            </td><td> base  </td><td>350 k</td></tr>
<tr><td> perl-DBD-MySQL      </td><td> x86__64</td><td>   4.013-3.el6               </td><td> base  </td><td>134 k</td></tr>
<tr><td> perl-DBI            </td><td> x86__64</td><td>   1.609-4.el6               </td><td> base  </td><td>705 k</td></tr>
<tr><td> perl-Error          </td><td> noarch</td><td>  1:0.17015-4.el6           </td><td> base  </td><td> 29 k</td></tr>
<tr><td> perl-Git            </td><td> noarch</td><td>  1.7.1-3.el6_4.1           </td><td> updates</td><td>  28 k</td></tr>
<tr><td> php54-cli           </td><td> x86__64</td><td>   5.4.13-1.ius.el6          </td><td> ius   </td><td>2.5 M</td></tr>
<tr><td> php54-common        </td><td> x86__64</td><td>   5.4.13-1.ius.el6          </td><td> ius   </td><td>865 k</td></tr>
<tr><td> pixman              </td><td> x86__64</td><td>   0.26.2-5.el6_4            </td><td> updates</td><td> 200 k</td></tr>
<tr><td> polkit              </td><td> x86__64</td><td>   0.96-2.el6_0.1            </td><td> base  </td><td>158 k</td></tr>
<tr><td> rsync               </td><td> x86__64</td><td>   3.0.6-9.el6               </td><td> base  </td><td>334 k</td></tr>
<tr><td> sgml-common         </td><td> noarch</td><td>  0.6.3-32.el6              </td><td> base  </td><td> 43 k</td></tr>
<tr><td> t1lib               </td><td> x86__64</td><td>   5.1.2-6.el6_2.1           </td><td> base  </td><td>160 k</td></tr>
<tr><td> urw-fonts           </td><td> noarch</td><td>  2.4-10.el6                </td><td> base  </td><td>3.1 M</td></tr>
<tr><td> xorg-x11-font-utils </td><td> x86__64</td><td>   1:7.2-11.el6              </td><td> base  </td><td> 75 k</td></tr>
<tr><td> xorg-x11-proto-devel</td><td> noarch</td><td>  7.6-25.el6                </td><td> base  </td><td>274 k</td></tr>
<tr><th colspan="5"><br><h3>Updating/depends</h3></th></tr>
<tr><td> dbus-libs           </td><td> x86__64</td><td>   1:1.2.24-7.el6_3          </td><td> base  </td><td>127 k</td></tr>
<tr><td> zlib                </td><td> x86__64</td><td>   1.2.3-29.el6              </td><td> base  </td><td> 73 k</td></tr>
<tr><td> zlib-devel          </td><td> x86__64</td><td>   1.2.3-29.el6              </td><td> base  </td><td> 44 k</td></tr>
</tbody>
</table>
