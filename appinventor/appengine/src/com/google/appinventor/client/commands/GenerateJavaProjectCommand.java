package com.google.appinventor.client.commands;

import com.google.appinventor.client.Ode;
import com.google.appinventor.client.explorer.commands.ChainableCommand;
import com.google.appinventor.client.explorer.commands.GenerateJavaCommand;
import com.google.appinventor.client.explorer.commands.GenerateManifestCommand;
import com.google.appinventor.client.explorer.commands.SaveAllEditorsCommand;
import com.google.appinventor.client.tracking.Tracking;
import com.google.appinventor.client.utils.Downloader;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.ProjectRootNode;
import com.google.gwt.user.client.Command;

public class GenerateJavaProjectCommand implements Command {
  @Override
  public void execute() {
    final long projectId = Ode.getInstance().getCurrentYoungAndroidProjectId();
    final ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
    final String projectName = Ode.getInstance().getCurrentYoungAndroidProjectRootNode().getName();
    final String userName = Ode.getInstance().getUser().getUserName();
    //generate and download project
    ChainableCommand cmd = new SaveAllEditorsCommand(new GenerateJavaCommand(null));
    cmd.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_YAIL_YA, projectRootNode,
            new Command() {
              @Override
              public void execute() {
                ChainableCommand cmd1 = new SaveAllEditorsCommand(new GenerateManifestCommand(null));
                cmd1.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_YAIL_YA, projectRootNode,
                        new Command() {
                          @Override
                          public void execute() {
                            //download project
                            Downloader.getInstance().download(ServerLayout.downloadJavaProjectPath(projectId,userName, projectName));
                          }
                        });
              }
            });
  }
}
